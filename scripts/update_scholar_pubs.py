import json
import os
import sys
import re
from scholarly import scholarly

# Path to the data file
data_file_path = './data/website-data.json'

def load_data():
    with open(data_file_path, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(data_file_path, 'w') as f:
        json.dump(data, f, indent=2)

def normalize_title(title):
    # Remove punctuation, make lowercase, strip extra whitespace
    if not title: return ""
    title = title.lower()
    title = re.sub(r'[^\w\s]', '', title)
    title = re.sub(r'\s+', ' ', title).strip()
    return title

def match_existing_pub(scholar_pub, existing_pubs):
    norm_scholar_title = normalize_title(scholar_pub.get('bib', {}).get('title', ''))
    for pub in existing_pubs:
        if not pub.get('title'): continue
        if normalize_title(pub['title']) == norm_scholar_title:
            return pub
    return None

def main():
    print("Searching for Dr. Wenlong Zhang...")
    search_query = scholarly.search_author('Wenlong Zhang')
    author = None
    for a in search_query:
        if 'Arizona State University' in a.get('affiliation', ''):
            author = a
            break
    
    if not author:
        print("Could not find author profile.")
        sys.exit(1)
        
    print(f"Found author: {author['name']}")
    print("Fetching publications (this may take a while to avoid rate limits)...")
    
    author = scholarly.fill(author, sections=['publications'])
    
    data = load_data()
    
    # Combine all existing pubs for easy lookup
    all_existing_pubs = []
    if 'journalPubs' in data: all_existing_pubs.extend(data['journalPubs'])
    if 'confPubs' in data: all_existing_pubs.extend(data['confPubs'])
    if 'patentPubs' in data: all_existing_pubs.extend(data['patentPubs'])
    
    new_pubs_added = 0
    pubs_updated = 0
    
    print(f"Found {len(author['publications'])} publications on Google Scholar.")
    
    for idx, pub in enumerate(author['publications']):
        print(f"Processing pub {idx + 1}/{len(author['publications'])}...")
        try:
            pub = scholarly.fill(pub)
        except Exception as e:
            print(f"Error fetching details for a publication: {e}")
            continue
            
        bib = pub.get('bib', {})
        title = bib.get('title')
        if not title: continue
        
        # Determine category based on venue / pub_url / etc.
        venue = bib.get('journal', '')
        if not venue: venue = bib.get('conference', '')
        if not venue: venue = bib.get('booktitle', '')
        if not venue: venue = bib.get('publisher', '')
        if not venue: venue = bib.get('citation', '')
        
        venue_lower = venue.lower()
        
        pub_url = pub.get('pub_url', '')
        
        is_patent = 'patent' in venue_lower or 'patent' in pub_url.lower()
        is_conf = 'conf' in venue_lower or 'proc' in venue_lower or 'symposium' in venue_lower or 'icra' in venue_lower or 'iros' in venue_lower
        
        target_list_name = 'journalPubs'
        if is_patent: target_list_name = 'patentPubs'
        elif is_conf: target_list_name = 'confPubs'
        
        year_str = bib.get('pub_year', '')
        try:
            year = int(year_str) if year_str else None
        except ValueError:
            year = None
            
        authors = bib.get('author', '')
        
        existing_pub = match_existing_pub(pub, all_existing_pubs)
        
        if existing_pub:
            # Update existing
            updated = False
            if not existing_pub.get('url') and pub_url:
                existing_pub['url'] = pub_url
                updated = True
            if not existing_pub.get('year') and year:
                existing_pub['year'] = year
                updated = True
            if not existing_pub.get('authors') and authors:
                existing_pub['authors'] = authors
                updated = True
            if not existing_pub.get('venue') and venue:
                existing_pub['venue'] = venue
                updated = True
                
            if updated:
                print(f"Updated existing pub: {title}")
                pubs_updated += 1
        else:
            # Add new
            new_pub = {
                'title': title,
                'authors': authors,
                'venue': venue,
                'year': year,
                'url': pub_url
            }
            if target_list_name not in data:
                data[target_list_name] = []
            
            data[target_list_name].append(new_pub)
            all_existing_pubs.append(new_pub)
            print(f"Added new pub [{target_list_name}]: {title}")
            new_pubs_added += 1
            
    print(f"Finished fetching. Added {new_pubs_added} new pubs, updated {pubs_updated} existing pubs.")
    
    save_data(data)
    print("Saved to website-data.json")

if __name__ == '__main__':
    main()

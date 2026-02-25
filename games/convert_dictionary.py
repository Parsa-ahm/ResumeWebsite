#!/usr/bin/env python3
"""
Convert word_list_scrabble_2019.txt to a JavaScript file that can be loaded directly.
This avoids CORS issues when loading the dictionary.
"""

print("Reading word list...")
with open('word_list_scrabble_2019.txt', 'r', encoding='utf-8') as f:
    words = [line.strip().lower() for line in f if len(line.strip()) >= 3]

print(f"Found {len(words)} valid words (3+ characters)")

# Create JavaScript file
print("Creating dictionary.js...")
with open('dictionary.js', 'w', encoding='utf-8') as f:
    f.write('// Scrabble 2019 Word List\n')
    f.write('// This file contains the dictionary words as a JavaScript array\n')
    f.write('// Generated automatically from word_list_scrabble_2019.txt\n\n')
    f.write('const DICTIONARY_WORDS = [\n')
    
    # Write words in a compact format
    for i, word in enumerate(words):
        if i == len(words) - 1:
            f.write(f'  "{word}"\n')
        else:
            f.write(f'  "{word}",\n')
    
    f.write('];\n\n')
    f.write('// Export for use\n')
    f.write('if (typeof window !== "undefined") {\n')
    f.write('  window.DICTIONARY_WORDS = DICTIONARY_WORDS;\n')
    f.write('}\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n')
    f.write('  module.exports = DICTIONARY_WORDS;\n')
    f.write('}\n')

print(f"Created dictionary.js with {len(words)} words")
print("The dictionary is now available as DICTIONARY_WORDS in JavaScript")






from flashtext import KeywordProcessor
import pandas as pd

# Load your skills from the Excel file
skills_df = pd.read_excel('Technology Skills.xlsx')
possible_skills = skills_df['Example'].dropna().str.strip().tolist()

# Initialize the KeywordProcessor (very fast)
kp = KeywordProcessor(case_sensitive=False)
kp.add_keywords_from_list(possible_skills)

# Function to extract skills from resume string
def extract_skills_from_text(text: str):
    return list(set(kp.extract_keywords(text)))

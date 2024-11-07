import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

df = pd.read_csv('./data/labels.csv')

text_data = df['label']
labels = df['value']


vectorizer = CountVectorizer()
X_train_vectorized = vectorizer.fit_transform(text_data)       

model = MultinomialNB()
model.fit(X_train_vectorized, labels)

joblib.dump(model, './models/action_classification.joblib')
joblib.dump(vectorizer, './models/text_vectorizer.joblib')
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

class SentimentAnalyzer:
    def __init__(self, model_type='lightweight'):
        self.model_type = model_type
        if model_type == 'lightweight':
            # Assumes you have previously trained & saved these
            self.vectorizer = joblib.load('models/tfidf_vectorizer.joblib')
            self.model = joblib.load('models/logistic_model.joblib')
        elif model_type == 'bert':
            model_name = "distilbert-base-uncased-finetuned-sst-2-english"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSequenceClassification.from_pretrained(model_name)
            # Create pipeline with truncation/padding
            self.pipe = pipeline(
                "sentiment-analysis",
                model=model,
                tokenizer=self.tokenizer,
                truncation=True,
                padding=True,
                return_all_scores=False
            )
            # expose max length from tokenizer config
            self.max_length = self.tokenizer.model_max_length if hasattr(self.tokenizer, "model_max_length") else 512

    def predict(self, texts):
        results = []
        if self.model_type == 'lightweight':
            X = self.vectorizer.transform(texts)
            preds = self.model.predict(X)
            probs = self.model.predict_proba(X)
            for label, prob in zip(preds, probs):
                confidence = max(prob)
                results.append({
                    "sentiment": label,
                    "confidence": confidence
                })
        elif self.model_type == 'bert':
            # Ensure all inputs are strings
            clean_texts = [str(t) if t is not None else "" for t in texts]
            raw_outputs = self.pipe(clean_texts, truncation=True, max_length=self.max_length)
            for out in raw_outputs:
                label = out["label"]
                score = out["score"]
                sentiment = label.lower()
                results.append({
                    "sentiment": sentiment,
                    "confidence": score
                })
        return results

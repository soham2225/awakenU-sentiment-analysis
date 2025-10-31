import subprocess

commands = [
    "python src/ingestion/twitter_ingestion.py",
    "python src/preprocessing/twitter_cleaner.py",
    "python src/analysis/twitter_sentiment.py",
    "python -m src.analysis.analyze_feedback",
    "python -m src.analysis.tagging_engine",
    "python -m src.analysis.alert_engine"
]

print("🚀 Starting Twitter pipeline automation...\n")

for cmd in commands:
    print(f"▶️ Running: {cmd}")
    try:
        subprocess.run(cmd, shell=True, check=True)
        print(f"✅ Finished: {cmd}\n")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error while running: {cmd}")
        print(e)
        break

print("🎉 All tasks completed successfully!")

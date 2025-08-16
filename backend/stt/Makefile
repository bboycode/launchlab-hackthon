run-tests:
	@for f in test_*.py; do python "$$f"; done

test-chat:
	 curl -X POST http://localhost:5000/chat/query   -H "Content-Type: application/json"   -d '{"message": "Is there a doctor named Emily?"}'

test-transcribe:
	curl -X POST http://localhost:5000/transcribe/audio   -F "audio_file=@./consultation_x1_combined_dialogue.mp3"
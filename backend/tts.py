import sys
import os
import subprocess

def speak(text: str):
    """
    Convert text to speech using pyttsx3, with fallback to macOS 'say' command.
    
    Args:
        text (str): The text to be spoken.
    """
    try:
        import pyttsx3
        # Initialize the engine
        engine = pyttsx3.init()
        
        # Optional: Configure properties (rate, volume, voice)
        # rate = engine.getProperty('rate')
        # engine.setProperty('rate', 150)
        
        print(f"Speaking (pyttsx3): {text}")
        engine.say(text)
        engine.runAndWait()
        
    except Exception as e:
        print(f"pyttsx3 failed: {e}")
        if sys.platform == 'darwin':
            print(f"Falling back to system 'say' command...")
            try:
                subprocess.run(['say', text], check=True)
            except Exception as fallback_error:
                print(f"Fallback failed: {fallback_error}")
        else:
            print("No TTS fallback available for this platform.")

if __name__ == "__main__":
    print("Text to Speech Test")
    print("-------------------")
    # Interactive input
    try:
        if len(sys.argv) > 1:
             user_input = " ".join(sys.argv[1:])
        else:
             user_input = input("Enter text to speak: ")
        
        if user_input:
            speak(user_input)
        else:
            print("No input provided.")
    except KeyboardInterrupt:
        print("\nExiting...")

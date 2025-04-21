import os
import List
tool_code from typing


def read_file(filename: str) -> str:
    """Reads the content of a file. Args: filename: The name of the file to read. Returns: The content of the file as a string. """
    try:
        with open(filename, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return f"Error: File '{filename}' not found."
    except Exception as e:
        return f"Error reading file '{filename}': {e}"


def answer_question(question: str, files: List[str]) -> str:
    """Answers a question based on the content of the given files. Args: question: The question to answer. files: A list of filenames to read and use as context. Returns: The answer to the question, based on the file contents. """
    file_contents = {}
    for filename in files:
        file_contents[filename] = read_file(filename)
        # Attempt to answer the question based on the file contents.
        answer = "I'm sorry, I couldn't find the answer to your question in the provided files."
        if "Tumor del saco vitelino" in file_contents:
            content = file_contents["Tumor del saco vitelino"]
            if "células" in question.lower() and "tipo" in question.lower():
                if "células germinales" in content.lower():
                    answer = "El tumor del saco vitelino es un tipo de tumor de células germinales."
                    # Basic answer, refine if more detail is available in the file.
                else:
                    answer = "The file 'Tumor del saco vitelino' discusses this tumor, but does not explicitly state the cell type."
                return answer
            # Example usage: question = "de que tipo de celulas es el tumor del saco vitelino?" files = ["Tumor del saco vitelino"] answer = answer_question(question, files) print(answer)

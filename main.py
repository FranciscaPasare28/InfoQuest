from flask import Flask, request, jsonify
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, AutoModelForQuestionAnswering, pipeline

app = Flask(__name__)
model_path = r'C:\Users\pasar\OneDrive - unibuc.ro\Desktop\Licenta2024\Models\bart_samsum_model'
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

#model_path_answearing = r'C:\Users\pasar\OneDrive - unibuc.ro\Desktop\Licenta2024\Models\my_roberta_qa_model'
#model_path_answearing = r'C:\Users\pasar\OneDrive - unibuc.ro\Desktop\Licenta2024\Models\my_roberta_qa_model_2'
model_path_answearing = r'C:\Users\pasar\OneDrive - unibuc.ro\Desktop\Licenta2024\Models\my_roberta_squad2_15'

model_qa = AutoModelForQuestionAnswering.from_pretrained(model_path_answearing)
tokenizer_qa = AutoTokenizer.from_pretrained(model_path_answearing)
qa_pipeline = pipeline("question-answering", model=model_qa, tokenizer=tokenizer_qa)

@app.route('/summarize', methods=['POST'])
def summarize():
    input_text = request.json['text']
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    outputs = model.generate(inputs['input_ids'], attention_mask=inputs['attention_mask'], max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({'summary': summary})

@app.route('/answer', methods=['POST'])
def answer():
    # Extrage întrebarea și contextul din cererea POST
    data = request.get_json()
    question = data['question']
    context = data['context']
    
    # Utilizează pipeline-ul pentru a obține răspunsul
    answer = qa_pipeline({'question': question, 'context': context})
    
    # Returnează răspunsul ca JSON
    return jsonify(answer)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

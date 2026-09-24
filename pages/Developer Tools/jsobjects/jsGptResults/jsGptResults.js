export default {
  async setGPTResponse(query) {
    try {
      const response = await query.run({ prompt: inputGptPrompt.text });
      const newText = response.choices[0].message.content;
      txtGptResponse.setText(newText);
    } catch (err) {
      showAlert("Error fetching response: " + err.message, "error");
    }
  }
}

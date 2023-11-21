/**
 * Erwartet ein Quiz Objekt. Ergänzt die Fragen um UUIDs und speichert das Quiz in der "quizzes" collection. 
 */

const { v4: uuidv4 } = require('uuid');
exports = async function(payload) {
  
  const inputData = JSON.parse(payload);
  
  // Jeder Frage eine einmalige ID zuweisen
  inputData.questions = inputData.questions.map(question => {
    question.id = uuidv4(); // Eine neue UUID als ID
    return question;
  });
  
  // MongoDB-Service und Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const myCollection = mongodb.db("project-studyquiz").collection("quizzes");

  // Daten in der Collection speichern
  try {
    const result = await myCollection.insertOne(inputData);
    return { success: true, insertedId: result.insertedId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

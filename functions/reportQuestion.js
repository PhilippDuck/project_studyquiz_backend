/**
 * Fügt eine Frage der Collection "reportedQuestion" hinzu, allerdings nur wenn die Frage noch nicht vorhanden ist.
 */

exports = async function reportQuestion(payload) {
  // MongoDB-Service und die richtige Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const reportedQuestionsCollection = mongodb.db("project-studyquiz").collection("reportedQuestions");

  try {
    // Die ID aus dem Payload extrahieren
    const questionId = payload.question.id;

    // Überprüfen, ob eine Frage mit derselben ID bereits existiert
    const existingQuestion = await reportedQuestionsCollection.findOne({ "question.id": questionId });

    // Wenn eine Frage mit derselben ID bereits existiert, gebe eine Fehlermeldung zurück
    if (existingQuestion) {
      return { status: "error", message: "Diese Frage wurde bereits gemeldet." };
    }

    // Wenn die Frage mit der ID noch nicht existiert, speichere sie
    const result = await reportedQuestionsCollection.insertOne(payload);
    
    // Überprüfen, ob das Einfügen erfolgreich war
    if (result.insertedId) {
      return { status: "success", message: "Frage erfolgreich gemeldet." };
    } else {
      return { status: "error", message: "Fehler beim Speichern der Frage." };
    }
  } catch (error) {
    return { status: "error", message: error.message, payload: payload };
  }
};

/**
 * Entfernt eine Frage anhand der übergebenen Id aus der "reportedQuestions" Collection.
 */

exports = async function releaseReportedQuestionById(questionId) {
  // MongoDB-Service und die richtige Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const reportedQuestionsCollection = mongodb.db("project-studyquiz").collection("reportedQuestions");

  try {
    // Überprüfen, ob eine Frage mit derselben ID vorhanden ist
    const existingQuestion = await reportedQuestionsCollection.findOne({ "question.id": questionId });

    // Wenn eine Frage mit derselben ID gefunden wurde, entferne sie aus der Sammlung
    if (existingQuestion) {
      const deleteResult = await reportedQuestionsCollection.deleteOne({ "question.id": questionId });

      // Überprüfen, ob das Löschen erfolgreich war
      if (deleteResult.deletedCount === 1) {
        return { status: "success", message: "Frage erfolgreich freigegeben." };
      } else {
        return { status: "error", message: "Fehler beim Entfernen der Frage." };
      }
    } else {
      return { status: "error", message: "Frage nicht gefunden." };
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

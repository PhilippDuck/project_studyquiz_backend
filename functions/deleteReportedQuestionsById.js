/**
 * Funktion `deleteReportedQuestion` - Löscht eine gemeldete Frage aus einem Quiz-System.
 * 
 * Schritte:
 * 1. Verbindet sich mit MongoDB und wählt die Kollektionen `reportedQuestions` und `quizzes`.
 * 2. Startet eine Datenbanktransaktion für Konsistenz und Fehlerbehandlung.
 * 3. Sucht nach der gemeldeten Frage in `reportedQuestions` mit der gegebenen `questionId`.
 * 4. Wenn die Frage gefunden wird, wird sie aus dem entsprechenden Quiz in `quizzes` entfernt:
 *    - Falls es die letzte Frage im Quiz ist, wird das gesamte Quiz gelöscht.
 *    - Andernfalls wird nur die spezifische Frage entfernt.
 * 5. Die gemeldete Frage wird ebenfalls aus `reportedQuestions` gelöscht.
 * 6. Schließt die Transaktion ab und gibt einen Erfolgs- oder Fehlerstatus zurück.
 * 
 * Nutzt Transaktionen für sichere und konsistente Datenänderungen und behandelt Fehler angemessen.
 */


exports = async function deleteReportedQuestion(questionId) {
  // MongoDB-Service und die richtige Collection auswählen
  const mongodb = context.services.get("mongodb-atlas");
  const reportedQuestionsCollection = mongodb.db("project-studyquiz").collection("reportedQuestions");
  const quizzesCollection = mongodb.db("project-studyquiz").collection("quizzes");

  const session = mongodb.startSession();
  session.startTransaction();

  try {
    // Überprüfen, ob eine Frage mit derselben ID in der "reportedQuestions"-Sammlung vorhanden ist
    const existingReportedQuestion = await reportedQuestionsCollection.findOne({ "question.id": questionId });

    // Wenn eine gemeldete Frage mit derselben ID gefunden wurde
    if (existingReportedQuestion) {
      // Das gesamte Dokument aus der "quizzes"-Sammlung finden
      const quizDocument = await quizzesCollection.findOne({ "questions.id": questionId });

      if (quizDocument) {
        // Das gesamte Array von Fragen
        const questionsArray = quizDocument.questions;

        // Die Anzahl der verbleibenden Fragen im Array ermitteln
        const remainingQuestions = questionsArray.filter(question => question.id !== questionId);

        // Wenn die Frage die letzte im Array ist, das gesamte Dokument löschen
        if (remainingQuestions.length === 0) {
          await quizzesCollection.deleteOne({ "_id": quizDocument._id }, { session });
        } else {
          // Andernfalls die Frage aus dem Array entfernen
          await quizzesCollection.updateOne(
            { "_id": quizDocument._id },
            { $set: { "questions": remainingQuestions } },
            { session }
          );
        }
      }

      // Die Frage aus der "reportedQuestions"-Sammlung löschen
      await reportedQuestionsCollection.deleteOne({ "question.id": questionId }, { session });

      // Transaktion abschließen
      await session.commitTransaction();
      session.endSession();

      return { status: "success", message: "Frage erfolgreich gelöscht." };
    } else {
      return { status: "error", message: "Frage nicht gefunden." };
    }
  } catch (error) {
    // Bei einem Fehler die Transaktion rückgängig machen
    await session.abortTransaction();
    session.endSession();

    return { status: "error", message: error.message };
  }
};

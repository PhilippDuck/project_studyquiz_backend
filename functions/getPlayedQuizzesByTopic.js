/**
 * Ist kein Parameter übergeben, werden alle gespielten Quiz zurückgegeben. Wird ein Thema (topic) als String übergeben,
 * werden nur die gespielten Quiz des Themas zurückgegeben.
 */

exports = async function (payload) {
  const mongo = context.services.get("mongodb-atlas");
  const playedQuizzesCollection = mongo.db("project-studyquiz").collection("playedQuizzes");
  const userDataCollection = mongo.db("project-studyquiz").collection("custom_userData");

  // Extrahieren des Topics aus dem Payload, falls vorhanden
  let topicFilter = {};
  if (payload && payload.topic) {
    topicFilter = { quizTopic: payload.topic };
  }

  // Abfrage der playedQuizzes basierend auf dem Thema (falls angegeben)
  const playedQuizzes = await playedQuizzesCollection.find({ ...topicFilter }).toArray();

  for (let i = 0; i < playedQuizzes.length; i++) {
    const playerData = await userDataCollection.findOne({ userId: playedQuizzes[i].playerId });
    playedQuizzes[i].playerNick = playerData ? playerData.nickname : "Unbekannt";

    if (!playedQuizzes[i].quizTopic || !playedQuizzes[i].quizTitle) {
      playedQuizzes[i].quizTitle = "Unbekannter Titel";
      playedQuizzes[i].quizTopic = "Unbekanntes Thema";
    }
  }

  // Sortieren der Quizzes zuerst nach Punkten und dann nach Zeit
  playedQuizzes.sort((a, b) => {
    if (a.points !== b.points) {
      // Sortieren nach Punkten in absteigender Reihenfolge
      return b.points - a.points;
    } else {
      // Bei gleicher Punktzahl, sortieren nach kürzester Zeit
      return (a.endTime - a.startTime) - (b.endTime - b.startTime);
    }
  });

  console.log("Played Quizzes after processing and sorting:", playedQuizzes);
  return playedQuizzes;
};

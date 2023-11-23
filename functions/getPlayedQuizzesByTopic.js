/**
 * Ist kein Parameter übergeben, werden alle gespielten Quiz zurückgegeben. Wird ein Thema (topic) als String übergeben,
 * werden nur die gespielten Quiz des Themas zurückgegeben.
 */

exports = async function (payload) {
  const mongo = context.services.get("mongodb-atlas");
  const playedQuizzesCollection = mongo.db("project-studyquiz").collection("playedQuizzes");
  const userDataCollection = mongo.db("project-studyquiz").collection("custom_userData");

  let topicFilter = {};
  if (payload && payload.topic) {
    topicFilter = { quizTopic: payload.topic };
  }

  // Hinzufügen einer Sortieroption, um nach dem neuesten Datum zu sortieren, wenn kein Thema angegeben ist
  const sortOption = payload && payload.topic ? {} : { createdAt: -1 }; 

  const playedQuizzes = await playedQuizzesCollection.find({ ...topicFilter }).sort(sortOption).toArray();

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
      return b.points - a.points;
    } else {
      return (a.endTime - a.startTime) - (b.endTime - b.startTime);
    }
  });

  console.log("Played Quizzes after processing and sorting:", playedQuizzes);
  return playedQuizzes;
};

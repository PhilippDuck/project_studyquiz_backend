/**
 * Gibt alle gemeldeten Fragen zurück.
 */
exports = function(payload) {
  const docs = context.services
  .get("mongodb-atlas")
  .db("project-studyquiz")
  .collection("reportedQuestions")
  .find({}).toArray();
  
  return docs;
};

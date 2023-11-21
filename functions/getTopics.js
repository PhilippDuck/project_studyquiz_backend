/**
 * Gibt alle verfügbaren Themen zurück. 
 */
 
exports = function(payload) {
  const docs = context.services
  .get("mongodb-atlas")
  .db("project-studyquiz")
  .collection("topics")
  .find({}).toArray();
  
  return docs;
};

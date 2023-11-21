/**
 * Wird beim erstellen eines neuen Nutzers getriggert.
 * legt ein Dokument mit Standartwerten in custom_userData an.
 */

exports = async function(user) {
  const userId = user.id;

  console.log("User ID from Payload:", userId);

  // Überprüfen, ob der Benutzer mit einer E-Mail registriert wurde
  const isRegisteredWithEmail = user.data.email ? true : false;

  const collection = context.services.get("mongodb-atlas").db("project-studyquiz").collection("custom_userData");
  const userDocument = {
    userId: userId,
    nickname: "NONAME",
    // Setze registered auf true, wenn der Benutzer mit E-Mail registriert wurde, sonst false
    registered: isRegisteredWithEmail,
    points: 0
  };

  try {
    // Füge das userDocument in die Sammlung ein
    await collection.insertOne(userDocument);

    console.log("Inserted custom user data.");

    return { status: "success" };
  } catch (e) {
    console.error(`Failed to insert custom user data: ${e}`);
    throw new Error(`Failed to insert custom user data: ${e}`);
  }
};

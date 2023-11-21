/**
 * Überprüft den übergebenen Nicknamen und speichert diesen für den angegebenen Nutzer, wenn Regeln erfüllt sind.
 */

exports = async function(payload) {
    const { userId, nickname } = payload;

    if (!userId || !nickname) {
        return { success: false, message: "UserId und Nickname müssen angegeben werden" };
    }

    // Nickname bereinigen
    const cleanedNickname = nickname.trim();

    // Überprüfen Sie die Nickname-Bedingungen
    if (!cleanedNickname) {
        return { success: false, message: "Nickname darf nicht leer sein." };
    }

    if (cleanedNickname.length > 20) {
        return { success: false, message: "Nickname darf nicht länger als 20 Zeichen sein." };
    }

    if (/[^a-zA-Z0-9 _-]/.test(cleanedNickname)) {
        return { success: false, message: "Der Nickname darf nur Buchstaben, Zahlen, Leerzeichen, Unterstriche (_) und Bindestriche (-) enthalten." };
    }

    const mongodb = context.services.get("mongodb-atlas");
    const usersCollection = mongodb.db("project-studyquiz").collection("custom_userData");

    // Überprüfen, ob der Nickname bereits existiert
    const existingUserWithNickname = await usersCollection.findOne({ nickname: cleanedNickname });
    if (existingUserWithNickname && existingUserWithNickname.userId !== userId) {
        return { success: false, message: "Dieser Nickname ist bereits vergeben." };
    }

    // Suche nach userId statt _id
    const result = await usersCollection.updateOne(
        { userId: userId },
        { 
            $set: { 
                nickname: cleanedNickname,
                userId: userId 
            }
        },
        { upsert: true }
    );

    // Überprüfen, ob die Aktualisierung erfolgreich war
    if (result.matchedCount === 0 && result.upsertedCount === 0) {
        return { success: false, message: "Aktualisierung fehlgeschlagen." };
    }

    return { success: true, message: "Nickname erfolgreich aktualisiert." };
};

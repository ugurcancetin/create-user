const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;

    try {
        const userDocRef = admin.firestore().collection('users').doc(uid);

        // Check if user document already exists
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            console.log('User document already exists:', userDoc.id);
            return;
        }

        // Create user document in Firestore
        await userDocRef.set({
            email,
            displayName,
            photoURL,
            subscribed: false,
            subscriptionType: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('User document created:', userDocRef.id);
    } catch (error) {
        console.error('Error creating user document:', error);
    }
});

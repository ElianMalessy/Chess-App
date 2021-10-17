import { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	signInAnonymously,
	sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	function signup(email, password) {
		return createUserWithEmailAndPassword(auth, email, password);
	}

	function login(email, password) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function logout() {
		return signOut(auth);
	}

	function resetPassword(email) {
		return sendPasswordResetEmail(auth, email);
	}

	function anonSignup() {
		return signInAnonymously(auth);
	}
	function updateEmail(email) {
		return currentUser.updateEmail(auth, email);
	}

	function updatePassword(password) {
		return currentUser.updatePassword(auth, password);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		login,
		signup,
		logout,
		anonSignup,
		resetPassword,
		updateEmail,
		updatePassword
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

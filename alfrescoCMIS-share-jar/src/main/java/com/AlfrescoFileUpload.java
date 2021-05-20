package com;


import java.io.IOException;

public class AlfrescoFileUpload {

	public static void main(String[] args) {
		Connexion connection = new Connexion();
		try {
			connection.athen();
		} catch (IOException e) {
			e.printStackTrace();
		}

		Dossier d = new Dossier();
		d.f();

	}
}

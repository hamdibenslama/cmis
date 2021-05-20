package com;


import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.apache.chemistry.opencmis.client.api.SessionFactory;
import org.apache.chemistry.opencmis.client.runtime.SessionFactoryImpl;
import org.apache.chemistry.opencmis.commons.SessionParameter;

import org.apache.chemistry.opencmis.commons.enums.BindingType;

public class Connexion {
	public void athen() throws IOException {
		try {
			FileInputStream fis = new FileInputStream("/alfrescoCMIS-share-jar/src/main/resources/alfresco/paramAlfresco.properties");
			Properties prop = new Properties();
			SessionFactory factory = SessionFactoryImpl.newInstance();
			Map<String, String> parameter = new HashMap<String, String>();
			String login = prop.getProperty("alfresco.login");
			String password = prop.getProperty("alfresco.password");
			String url = prop.getProperty("alfresco.Url");
			prop.load(fis);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}
}
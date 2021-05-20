package com;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.api.SessionFactory;
import org.apache.chemistry.opencmis.client.runtime.SessionFactoryImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;

public class Dossier {
	
	public void f() {
		
	
	 SessionFactory factory = SessionFactoryImpl.newInstance();
	  Map<String, String> parameter = new HashMap<String, String>();

	  

	  // create session
	  Session session = factory.getRepositories(parameter).get(0)
	    .createSession();
	  Folder root =  session.getRootFolder();

	  // properties
	  Map<String, Object> properties = new HashMap<String, Object>();
	  properties.put(PropertyIds.OBJECT_TYPE_ID, "cmis:folderr");
	  properties.put(PropertyIds.NAME, "Folderrrrr"); 
	 
	  // folder name

	  // create the folder
	  Folder parent = root.createFolder(properties);

	  String name = "Filee.txt";

	  // properties
	  Map<String, Object> properties2 = new HashMap<String, Object>();
	  properties2.put(PropertyIds.OBJECT_TYPE_ID, "cmis:documentt");
	  properties2.put(PropertyIds.NAME, name);
	
	  // content
	  byte[] content = "Hello hamdikk.;..!".getBytes();
	  InputStream stream = new ByteArrayInputStream(content);
	  ContentStream contentStream = new ContentStreamImpl(name,
	    BigInteger.valueOf(content.length), "text/plain", stream);

	  // create a major version
	  Document newDoc = parent.createDocument(properties2, contentStream,
	    VersioningState.MAJOR);

	  System.out.println("DONE.");
	  }

}

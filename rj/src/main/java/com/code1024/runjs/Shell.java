package com.code1024.runjs;

import java.io.File;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;

public class Shell {
	static Method addURL;
	static URLClassLoader classLoader;
	static {
		classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
		try {
			addURL = URLClassLoader.class.getDeclaredMethod("addURL", new Class[] {URL.class});
			addURL.setAccessible(true);
		} catch (NoSuchMethodException | SecurityException e) {
			e.printStackTrace();
		}
	}
	static void addURL(File file) {
        try {
            addURL.invoke(classLoader, new Object[] { file.toURI().toURL() });
        }catch (Exception e) {
        	e.printStackTrace();
        }
    }
	static void addJarFile(File jarFile){
		System.out.println("addJar:"+ jarFile);
		addURL(jarFile);
	}
	static void loadExtJars() throws URISyntaxException{
		URL path = Shell.class.getProtectionDomain().getCodeSource().getLocation();
		if(path.toString().endsWith(".jar")){
			File f = new File(path.toURI());
			File p = f.getParentFile();
			System.out.println(p.getName());
			if("lib".equals(p.getName())){
				File extDir = new File(p.getParentFile(), "ext");
				if(extDir.exists() && extDir.isDirectory()){
					File[] fs = extDir.listFiles();
					for(File file : fs){
						if(file.isFile() && file.getName().endsWith(".jar")){
							addJarFile(file);
						}
					}
				}
			}
		}
	}
	
	static void loadInnerJs(JsEngine jse, String path) throws Exception{
		InputStream in = Shell.class.getResourceAsStream(path);
		jse.eval(in, "classpath:"+path);
		in.close();
	}
	
	public static void main(String[] args) throws Exception {
		
		loadExtJars();
	    
		JsEngine jse = new JsEngine();
		loadInnerJs(jse, "/js/json2.js");
		loadInnerJs(jse, "/js/base.js");
		
		if(args.length > 0){
			jse.put("args", args);
			String[] jspaths = args[0].split(",");
			for(String jspath : jspaths){
				jse.eval(new File(jspath));
			}
		}
	}

}

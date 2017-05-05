package com.code1024.runjs;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class JsEngine {
	
	private ScriptEngine scriptEngine;
	private Charset UTF8 = Charset.forName("UTF-8");
	
	public JsEngine() throws ScriptException, IOException {
		
		ScriptEngineManager manager = new ScriptEngineManager();
		this.scriptEngine = manager.getEngineByName("nashorn");//javascript
		if (this.scriptEngine == null) {
            throw new RuntimeException("Cannot load javascript engine!");
        }
		this.scriptEngine.put("__", this);
	}
	
	public void put(String key, Object value){
		this.scriptEngine.put(key, value);
	}
	
	public Object eval(Reader reader) throws ScriptException{
		return scriptEngine.eval(reader);
	}
	
	public Object eval(InputStream in, String sourceName) throws ScriptException {
		return eval(new InputStreamReader(in, UTF8), sourceName);
	}
	
	public Object eval(Reader reader, String fileName) throws ScriptException {
		String str = setFileName(fileName);
		try{
			return scriptEngine.eval(reader);
		}finally{
			setFileName(str);
		}
	}
	
	public Object eval(File f) throws ScriptException, IOException{
		FileInputStream in = null;
		try{
			in = new FileInputStream(f);
			return eval(in, f.getPath());
		}finally{
			if(in != null){
				in.close();
			}
		}
	}

	public Object eval(String script) throws ScriptException, NoSuchMethodException{
		return scriptEngine.eval(script);
	}
	
	public Object eval(String script, String fileName) throws ScriptException, NoSuchMethodException{
		String str = setFileName(fileName);
		try{
			return scriptEngine.eval(script);
		}finally{
			setFileName(str);
		}
	}
	
	public Object invokeFun(Object obj, String funName, Object... args) throws ScriptException, NoSuchMethodException{
		Invocable invoc = (Invocable) scriptEngine;
		return invoc.invokeMethod(obj, funName, args);
	}
	
	public Object invoke(String fun, Object... args) throws ScriptException, NoSuchMethodException{
		int pos = fun.indexOf(".");
		Invocable invoc = (Invocable) scriptEngine;
		if(pos != -1){
			String objName = fun.substring(0, pos);
			String funName = fun.substring(pos+1);
			return invoc.invokeMethod(scriptEngine.get(objName), funName, args);
		}
		return invoc.invokeFunction(fun, args);
	}
	
	/**
	 * 设置上文件路径，在抛出异常的时候就会正确显示source
	 * @param fileName
	 * @return
	 */
	public String setFileName(String fileName){
		String s = (String) this.scriptEngine.get(ScriptEngine.FILENAME);
		this.scriptEngine.put(ScriptEngine.FILENAME, fileName);
		return s;
	}

	
}

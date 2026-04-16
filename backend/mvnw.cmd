@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ea Stop { . \"$scriptDir.mvn/jvm.config\" }; &\"$scriptDir.mvn/wrapper/MavenWrapperDownloader.java\" 2>$null; if (-not $?) {&\"$scriptDir.mvn/wrapper/MavenWrapperDownloader.class\" 2>$null}; $javaHome = $env:JAVA_HOME; if(-not $javaHome) { $javaHome = & java -XshowSettings:property -version 2>&1 | ? { $_ -match 'java.home' } | % { $_ -replace 'java.home = ','' -replace '\\jre','' }; }; $mavenWrapperPropertyFile = \"$scriptDir.mvn/wrapper/maven-wrapper.properties\"; $mvnHomeEntryPrefix = 'distributionUrl='; (Get-Content $mavenWrapperPropertyFile) | Where-Object { $_.StartsWith($mvnHomeEntryPrefix) } | ForEach-Object {$tempDistUrl = $_.Replace($mvnHomeEntryPrefix,'').Replace('\"','').Trim(); $TMP_DOWNLOAD_URL = $tempDistUrl}; $MAVEN_WRAPPER_JAR_PATH = \"$scriptDir.mvn/wrapper/maven-wrapper.jar\"; if (Test-Path \"$MAVEN_WRAPPER_JAR_PATH\") { $CMD_LINE_ARGS = ''; } else { $CMD_LINE_ARGS = $TMP_DOWNLOAD_URL; }; echo \"cmd=$javaHome/bin/java -jar $MAVEN_WRAPPER_JAR_PATH $CMD_LINE_ARGS\" }" 2>&1`) DO (
  IF "%%A"=="cmd" SET __MVNW_CMD__=%%B
  IF "%%A"=="error" SET __MVNW_ERROR__=%%B
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@IF NOT "%__MVNW_ERROR__%"=="" (
  @ECHO Cannot run maven from Cmd.exe with Java version too old for maven wrapper. Msg: %__MVNW_ERROR__% 1>&2
  @ECHO Falling back to use current Java. 1>&2
)
@IF "%__MVNW_CMD__%"=="" (
  @SETLOCAL
  @SET JAVA_HOME=
  @CALL :FindJavaFromJavaExecutable
  @IF NOT DEFINED JAVA_HOME (
    @ECHO Error: JAVA_HOME not found and java.exe not in PATH. 1>&2
    @EXIT /B 1
  )
  @SET __MVNW_CMD__=%JAVA_HOME%/bin/java -jar "%~dp0.mvn/wrapper/maven-wrapper.jar"
)
@SET MAVEN_PROJECTBASEDIR=%~dp0
@%__MVNW_CMD__% %__MVNW_CMD__%
@EXIT /B %ERRORLEVEL%
:FindJavaFromJavaExecutable
@for /f "tokens=*" %%a in ('where java 2^>nul') do (
  @set JAVA_EXE=%%a
  @goto FoundJavaExe
)
@EXIT /B 1
:FoundJavaExe
@for %%I in ("%JAVA_EXE%") do (
  @set JAVA_HOME=%%~dpI..
)
@SET JAVA_HOME=%JAVA_HOME:\\=\%
@EXIT /B 0

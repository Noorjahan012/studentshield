pipeline {
  agent any

    environment {
    SONAR_TOKEN = credentials('sonar-token')
    PATH = "C:\\Users\\new\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { bat 'npm ci' }
    }
    stage('Lint') {
      steps { bat 'npm run lint || exit 0' }
    }
    stage('SonarQube Scan') {
      steps { bat 'npx --yes @sonar/scan -Dsonar.qualitygate.wait=true' }
    }
    stage('Docker Build') {
      steps {
        withCredentials([
          string(credentialsId: 'supabase-url', variable: 'SB_URL'),
          string(credentialsId: 'supabase-key', variable: 'SB_KEY')
        ]) {
          bat 'docker build -t studentshield:%BUILD_NUMBER% --build-arg NEXT_PUBLIC_SUPABASE_URL=%SB_URL% --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=%SB_KEY% .'
        }
      }
    }
    stage('Run Container') {
      steps {
        bat 'docker rm -f studentshield-app 2>nul || exit 0'
        bat 'docker run -d -p 3001:3000 --name studentshield-app studentshield:%BUILD_NUMBER%'
      }
    }
  }
}
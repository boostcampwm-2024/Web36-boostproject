pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Checkout') {
            steps {
                // Git 리포지토리에서 소스 코드를 가져옵니다.
                checkout scm
            }
        }
        stage('Build and Deploy') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                        string(credentialsId: 'QUERY_DB_PASSWORD', variable: 'QUERY_DB_PASSWORD'),
                        string(credentialsId: 'SESSION_SECRET', variable: 'SESSION_SECRET')
                    ]) {
                        // 민감 정보를 Secret 파일로 작성
                        writeFile file: 'db_password.txt', text: DB_PASSWORD
                        writeFile file: 'query_db_password.txt', text: QUERY_DB_PASSWORD
                        writeFile file: 'session_secret.txt', text: SESSION_SECRET
                        
                        // Docker Compose 빌드
                        sh 'docker-compose build'

                        // Docker Compose 실행
                        sh 'docker-compose up -d'
                    }
                }
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
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
                        // 기존 컨테이너 제거
                        sh 'docker-compose down'
                        
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
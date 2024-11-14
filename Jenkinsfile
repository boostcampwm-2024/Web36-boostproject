pipeline {
    agent any
    environment {
        NODE_ENV = 'test'  // 테스트 환경 설정
    }
    stages {
        stage('main Branch : Deployment'){
            when{
                allOf{
                    expression {
                        // 푸시 이벤트인지 확인
                        return env.GITHUB_EVENT_TYPE == 'push'
                    }
                    expression {
                        // 메인 브랜치에 대한 업데이트인지 확인
                        return env.BRANCH_NME == 'main'
                    }
                }
            }
            stages{
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
        }
        
        stage('environment var logging') {
            steps {
                script {
                    // 환경 변수 출력
                    echo "Checking environment variables:"
                    echo "CHANGE_ID: ${env.CHANGE_ID}"
                    echo "CHANGE_TARGET: ${env.CHANGE_TARGET}"
                }
            }
        }
        stage('Default Branch : Pull Request'){
            when {
                allOf {
                    expression {
                        // PR인지 확인하기 위해 CHANGE_ID 환경 변수 확인
                        return env.CHANGE_ID != null
                    }
                    expression {
                        // 대상 브랜치가 dev인지 확인
                        return env.CHANGE_TARGET != 'dev'
                    }
                }
            }
            steps{
                script {
                    // 스킵 코멘트 
                    withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                        def comment = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"body\": \"Jenkins : Dev 이외의 브랜치로의 PR - Test 스킵합니다.\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/issues/${env.CHANGE_ID}/comments"
                        sh comment
                    }
                }
            }
        }
        stage('Dev Branch : Pull Request') {
            when {
                allOf {
                    expression {
                        // PR인지 확인하기 위해 CHANGE_ID 환경 변수 확인
                        return env.CHANGE_ID != null
                    }
                    expression {
                        // 대상 브랜치가 dev인지 확인
                        return env.CHANGE_TARGET == 'dev'
                    }
                }
            }
            stages {
                stage('write Ci Test start review') {
                    steps{
                        script {
                            // GitHub API를 사용해 PR에 코멘트를 남깁니다
                            withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                                def comment = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"body\": \"Jenkins : Dev 브랜치로 PR 확인. CI test 를 수행합니다.\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/issues/${env.CHANGE_ID}/comments"
                                sh comment
                            }
                        }
                    }
                }
                stage('Checkout and Merge') {
                    steps {
                        checkout scm  // 소스 코드 가져오기
                        sh 'git branch'
                        sh 'git fetch origin dev'
                        sh 'git merge origin/dev'
                    }
                }
                stage('docker image Build') {
                    steps {
                        sh 'docker build -f .BE/dockerfile.test -t be-test-image ./BE/' 
                        sh 'docker build -f .FE/dockerfile.test -t fe-test-image ./FE/' 
                    }
                }
                stage('Run test & build') {
                    steps {
                        sh 'docker run --rm be-test-image'
                        sh 'docker run --rm fe-test-image'
                    }
                }
                stage('clean Up') {
                    steps {
                        sh 'docker rmi be-test-image'
                        sh 'docker rmi fe-test-image'
                    }
                }
                stage('write Ci Test success review') {
                    steps{
                        script {
                            withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                                def comment = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"body\": \"Jenkins : CI test 성공. 머지하세용~\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/issues/${env.CHANGE_ID}/comments"
                                sh comment
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            // 빌드 결과 알림 또는 후처리
            echo 'CI Test completed.'
        }
        success {
            echo 'Tests passed successfully!'
            script {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                    def commitStatus = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"state\": \"success\", \"context\": \"ci/test\", \"description\": \"Tests passed\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/statuses/${env.GIT_COMMIT}"
                    sh commitStatus
                }
            }
        }
        failure {
            echo 'Tests failed.'
            script {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                    def commitStatus = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"state\": \"failure\", \"context\": \"ci/test\", \"description\": \"Tests failed\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/statuses/${env.GIT_COMMIT}"
                    sh commitStatus
                    def comment = "curl -X POST -u \"${GITHUB_USER}:${GITHUB_TOKEN}\" -d '{\"body\": \"Jenkins : CI test 실패. 왜그런지는 몰?루. test 와 빌드 확인하세용~\"}' https://api.github.com/repos/boostcampwm-2024/web36-QLab/issues/${env.CHANGE_ID}/comments"
                    sh comment
                }
            }
        }
    }
}

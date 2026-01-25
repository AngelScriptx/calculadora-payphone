pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        PAYPHONE_TOKEN = credentials('PAYPHONE_TOKEN')
    }
    tools {
        nodejs "Node25"
        dockerTool "Dockertool" 
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/AngelScriptx/calculadora-payphone.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instala TODAS las dependencias incluyendo devDependencies
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                // Asegúrate de que jest use el preset correcto para ESM
                sh 'npx jest --config jest.config.mjs'
            }
        }

        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy with Docker') {
            steps {
                sh '''
                docker-compose down
                docker-compose build
                docker-compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Despliegue exitoso con Docker'
        }
        failure {
            echo 'Error en el pipeline'
        }
    }
}

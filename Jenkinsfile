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

        stage('Check Docker') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Forzar instalación de devDependencies aunque NODE_ENV=production
                sh 'npm install --include=dev'
                // Muestra dependencias y devDependencies instaladas
                sh 'npm list --depth=0'
                echo 'DevDependencies instaladas:'
                sh 'npm list --depth=0 --dev'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Next.js') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Usa el plugin dockerCompose (si está instalado)
                dockerCompose(
                    useComposeFiles: ['docker-compose.yml'], // archivo docker-compose
                    action: 'down',                            // baja contenedores si existen
                    options: ''                                // opcional
                )
                dockerCompose(
                    useComposeFiles: ['docker-compose.yml'],
                    action: 'build'                            // construye la imagen
                )
                dockerCompose(
                    useComposeFiles: ['docker-compose.yml'],
                    action: 'up',
                    options: '-d'                              // ejecuta en modo detached
                )
            }
        }
    } // Cierre de stages

    post {
        success {
            echo 'Despliegue exitoso con Docker'
        }
        failure {
            echo 'Error en el pipeline'
        }
    }
} // Cierre de pipeline

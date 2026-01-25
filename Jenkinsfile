pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        // Las credenciales se inyectan correctamente como variables de entorno
        PAYPHONE_TOKEN = credentials('PAYPHONE_TOKEN')
    }

    tools {
        nodejs "Node25"
        dockerTool "Dockertool" // Esto activará automáticamente la v27.0.3 en el PATH
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/AngelScriptx/calculadora-payphone.git'
            }
        }

        stage('Check Docker & Environment') {
            steps {
                // Verificamos que estamos usando la versión nueva
                sh 'docker --version'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instalamos todo, incluyendo devDependencies para poder buildear y testear
                sh 'npm install --include=dev'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Next.js') {
            steps {
                // Generamos el build de producción de Next.js
                sh 'npm run build'
            }
        }

     stage('Deploy with Docker Compose') {
    steps {
        script {
            // 1. Descargamos el binario de Docker Compose (v2.29.2 es una versión estable y moderna)
            // Lo bajamos directamente a /usr/local/bin para que sea global
            sh '''
                if ! command -v docker-compose &> /dev/null; then
                    echo "Instalando Docker Compose..."
                    curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
                    chmod +x /usr/local/bin/docker-compose
                    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose || true
                fi
            '''

            // 2. Ahora que ya existe, lo usamos con guion (que es como lo acabamos de instalar)
            sh 'docker-compose down'
            sh 'docker-compose up --build -d'
        }
    }
}
    }

    post {
        success {
            echo '¡Despliegue exitoso! La aplicación está corriendo en tu motor de Docker.'
        }
        failure {
            echo 'El pipeline falló. Revisa los logs de arriba.'
        }
    }
}
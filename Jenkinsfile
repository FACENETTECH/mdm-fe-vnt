pipeline {
    agent {label "FCIM_CLOUD"}
    stages{
        stage("Check old image") {
            steps {
                sh 'docker rm -f v2-fcim-cloud-mdm-fe || echo "this container does not exist" '
                sh 'docker image rm -f  v2-fcim-cloud-mdm-fe || echo "this image dose not exist" '
            }
        }
        stage('Build and Run') {
            steps {
                sh 'docker compose up -d --build'
             }
        }
    }
}

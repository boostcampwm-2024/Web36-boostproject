from locust import HttpUser, task, between

class User(HttpUser):
    # 대기 시간 설정 (10초에서 20초 사이)
    wait_time = between(5, 10)

    def on_start(self):
        # 첫 번째 API 호출 결과를 저장할 변수
        self.shellId = None
        # 첫 번째 API 호출
        response = self.client.post("/api/shells")
        if response.status_code == 201:
            self.shellId = response.json().get('data', {}).get('id')

    @task
    def call_apis(self):
        if self.shellId:
            # 쿼리 정의
            create_table_query = "SELECT BENCHMARK(20000000, POW(2, 1));"

            # 두 번째 API 호출
            response2 = self.client.post(
                f"/api/shells/{self.shellId}/execute",
                json={"query": create_table_query},
                name="POST /api/shells/{id}/execute"
            )

            if response2.status_code == 201:
                # 응답 데이터 파일에 저장
                data_to_write = response2.json().get('data', {}).get('text', '')
                User.log_to_file("locust_output.txt", data_to_write)

    @staticmethod
    def log_to_file(filename, data):
        with open(filename, "a") as file:
            file.write(data + "\n")
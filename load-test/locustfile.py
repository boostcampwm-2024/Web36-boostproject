from locust import HttpUser, task, between

class User(HttpUser):
    
    wait_time = between(10,20)
    
    def on_start(self):
        self.shellId = None  # API 호출 결과를 저장할 변수
 
    @task
    def call_apis(self):
        # Step 1: 첫 번째 API 호출
        response = self.client.post("/api/shells")

        if response.status_code == 201:
            self.shellId = response.json()['data']['id']


        # Step 2: 두 번째 API 호출 (첫 번째 응답값 사용)
        if self.shellId:
            # 테이블 생성 쿼리
            create_table_query = "SELECT BENCHMARK(20000000, POW(2, 1));"

            response2 = self.client.post(
                f"/api/shells/{self.shellId}/execute",
                json={"query": create_table_query}
            )

            if response2.status_code == 201:
                print(response2.json()['data']['text'])
import matplotlib.pyplot as plt
import re

# 파일 경로 설정
file_path = "locust_output.txt"

# 초 데이터를 추출하여 ms로 변환
response_times_ms = []

with open(file_path, "r") as file:
    for line in file:
        match = re.search(r"\((\d+\.\d+) sec\)", line)
        if match:
            seconds = float(match.group(1))  # 초 값을 추출
            response_times_ms.append(seconds * 1000)  # ms로 변환

# X축: 요청의 인덱스 (1부터 시작)
request_indices = list(range(1, len(response_times_ms) + 1))

# 차트 생성
plt.figure(figsize=(12, 6))
plt.plot(request_indices, response_times_ms, label="Query Execution Time", marker="o", markersize=1)
plt.title("Query Execution Time Analysis")
plt.xlabel("Number of Requests")
plt.ylabel("Query Execution Time (ms)")
plt.grid(True)
plt.legend()
plt.show()
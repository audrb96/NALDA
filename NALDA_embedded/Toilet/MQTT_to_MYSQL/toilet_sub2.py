import paho.mqtt.client as mqtt
import mysql.connector as mariadb

NALDA_db = mariadb.connect(host="nalda-db.c2k2xt6qu8x0.ap-northeast-2.rds.amazonaws.com",user='NALDA_admin',password='Blueskin741^',database='NALDA_db')
cur = NALDA_db.cursor()
global value
global my_topic

# 브로커 접속 시도 결과 처리 콜백 함수
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+ str(rc))
    if rc == 0:
        client.subscribe("toilet/#") # 연결 성공시 토픽 구독 신청
    else:
        print('연결 실패 : ', rc)
 
# 관련 토픽 메시지 수신 콜백 함수
def on_message(client, userdata, msg):
    global value
    global my_topic
    value = int(msg.payload.decode())
    my_topic=msg.topic.split('/');
    print(f" {my_topic} {value}")
    #print(f"{my_topic[1]}")
    cur = NALDA_db.cursor(prepared=True)
    #print("select toilet_id from toilet where airplane_id = (select airplane_id from airplane where airplane_kind = {kind}) and toilet_code={code};".format(kind=my_topic[1],code=my_topic[2]))
    cur.execute("select toilet_id from toilet where airplane_id = (select airplane_id from airplane where airplane_kind = '{kind}') and toilet_code='{code}';".format(kind=my_topic[1],code=my_topic[2]));
    toilet_id = cur.fetchone()[0]
    print(toilet_id)
    sql = "INSERT INTO toilet_log (used, toilet_id) VALUES (?,?);"
    val = (value,toilet_id)
    cur.execute(sql,val)
    NALDA_db.commit()
    print(cur.rowcount, "record inserted.")

# 1. MQTT 클라이언트 객체 인스턴스화
client = mqtt.Client()
 
# 2. 관련 이벤트에 대한 콜백 함수 등록
client.on_connect = on_connect
client.on_message = on_message
 
try :
    # 3. 브로커 연결
    client.connect("192.168.35.242")
 
    # 4. 메시지 루프 - 이벤트 발생시 해당 콜백 함수 호출됨
    client.loop_forever()
    
    # client.loop_start()
    # 새로운 스래드를 가동해서 운영 - daemon 스레드  Thread.setDaemon(True)

except Exception as err:
    print('에러 : %s'%err)
 
print("--- End Main Thread ---")



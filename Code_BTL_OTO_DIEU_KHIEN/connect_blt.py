import serial
import time

# Hàm gửi dữ liệu tới ESP32
def send_brl(data):
    try:
        # Mở kết nối Bluetooth
        BT = serial.Serial('COM7', 115200, timeout=1)
        print("Connected to COM7")

        # Gửi dữ liệu tới ESP32
        BT.write(data.encode('utf-8'))
        print(f"Sent: {data}")
        time.sleep(0.5)

        # Kiểm tra và nhận phản hồi từ ESP32 nếu có
        if BT.in_waiting > 0:  # Kiểm tra xem có dữ liệu nào trong hàng đợi không
            response = BT.readline().decode('utf-8').strip()
            print(f"Received response from ESP32: {response}")
            return response  # Trả về phản hồi cho người gọi hàm

    except serial.SerialException as e:
        print(f"Error sending data: {e}")
        return f"Error: {e}"
    finally:
        # Đóng kết nối sau khi gửi dữ liệu
        BT.close()
        print("Bluetooth connection closed")


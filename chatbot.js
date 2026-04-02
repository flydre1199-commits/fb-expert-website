class AIChatbot {
  constructor() {
    this.API_KEY = "sk-4bd27113b7dc78d1-lh6jld-f4f9c69f";
    this.API_URL = "https://9router.vuhai.io.vn/v1/chat/completions";
    this.MODEL_NAME = "ces-chatbot-gpt-5.4";

    // Google Sheets Lead Capture Config
    this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2VviIgkjpCauoxCixSIF8_uc7w0Ty-8_X7hUkzFIuaRYpTyo41rXddj4pCfphyntmUg/exec';
    this.SESSION_ID = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    this.LEAD_PATTERN = /\|\|LEAD_DATA:\s*(\{.*?\})\s*\|\|/;
    
    this.systemPrompt = "";
    this.messages = [];
    
    this.initDOMVariables();
    this.attachEventListeners();
    this.loadKnowledgeBase();
  }

  initDOMVariables() {
    this.chatWindow = document.getElementById("chatWindow");
    this.chatBody = document.getElementById("chatBody");
    this.chatInput = document.getElementById("chatInput");
    this.sendBtn = document.getElementById("sendBtn");
    this.fabBtn = document.getElementById("chatbotFab");
    this.closeBtn = document.getElementById("chatCloseBtn");
    this.refreshBtn = document.getElementById("chatRefreshBtn");
    this.refreshIcon = this.refreshBtn.querySelector("svg");
    
    // Typing indicator elements
    this.typingIndicator = document.createElement("div");
    this.typingIndicator.className = "typing-indicator-container";
    this.typingIndicator.innerHTML = `
      <div class="typing-status-text">Đang nhập...</div>
      <div class="typing-bubbles">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    `;
  }

  attachEventListeners() {
    this.fabBtn.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat());
    
    // Refresh Logic (BẮT BUỘC)
    this.refreshBtn.addEventListener("click", () => this.refreshChat());

    // Send Message
    this.sendBtn.addEventListener("click", () => this.handleUserSubmit());
    this.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleUserSubmit();
    });
  }

  async loadKnowledgeBase() {
    try {
      const response = await fetch("./chatbot_data.txt");
      let knowledgeBase = "Không có thông tin data.";
      if (response.ok) {
        knowledgeBase = await response.text();
      } else {
        console.error("Không tải được cơ sở dữ liệu cho chatbot!");
      }

      this.systemPrompt = `
Bạn là AI trợ lý cá nhân độc quyền trên website của chuyên gia F&B Hans Weber (Sommelier's Archive).
Nhiệm vụ của bạn là hỗ trợ khách truy cập lịch sự, cung cấp thông tin chính xác về các dịch vụ (Services), kinh nghiệm, và dự án (Portfolio) của chuyên gia này.

Dưới đây là cơ sở dữ liệu kiến thức (Knowledge Base) của bạn:
${knowledgeBase}

Quy tắc giao tiếp bắt buộc:
1. Luôn chào hỏi thân thiện, trang trọng (phù hợp với ngành nhà hàng cao cấp Châu Âu) và kết thúc bằng cách mời họ đặt thêm câu hỏi.
2. Bạn phải định dạng các câu trả lời của mình bằng Markdown đầy đủ (in đậm ý chính, dùng gạch đầu dòng, tạo code block nếu cần).
3. Nếu người dùng hỏi điều gì ngoài phạm vi dữ liệu trên, hãy tế nhị từ chối và hướng dẫn họ gửi email trực tiếp cho chuyên gia tại archive@hansweber.de.
4. Không được phép bịa đặt thông tin ngoài cơ sở dữ liệu đã cấp.

Quy tắc đặc biệt (LEAD EXTRACTION):
Trong quá trình trò chuyện, nếu bạn phát hiện người dùng cung cấp Tên, Số điện thoại hoặc Email, bạn HÃY VỪA trả lời họ bình thường, VỪA chèn thêm một đoạn mã JSON vào cuối cùng của câu trả lời theo đúng định dạng sau:
||LEAD_DATA: {"name": "...", "phone": "...", "email": "...", "interest": "...", "intent_level": "..."}||
Các trường cần trích xuất:
- name: Tên khách hàng
- phone: Số điện thoại
- email: Địa chỉ email
- interest: Khách quan tâm dịch vụ/sản phẩm gì? (tự phân tích từ ngữ cảnh hội thoại)
- intent_level: Mức độ sẵn sàng mua hàng, chỉ dùng 1 trong 3 giá trị: "hot" (muốn mua ngay, yêu cầu báo giá, đặt lịch), "warm" (đang tìm hiểu, so sánh), "cold" (chỉ hỏi chung chung)
Nếu thông tin nào chưa có, hãy để null.
TUYỆT ĐỐI KHÔNG giải thích hay đề cập đến đoạn mã này cho người dùng.
      `;

      // Set greeting message
      this.refreshChat(true);

    } catch (e) {
      console.error("Lỗi khi tải chatbot_data.txt", e);
    }
  }

  toggleChat() {
    this.chatWindow.classList.toggle("active");
    if (this.chatWindow.classList.contains("active")) {
      this.chatInput.focus();
    }
  }

  refreshChat(isInit = false) {
    // 1. Icon refresh phải có animation xoay
    this.refreshIcon.classList.add("spin");

    // 2. Xóa toàn bộ lịch sử chat
    this.chatBody.innerHTML = '';
    
    // Reset API message history
    this.messages = [
      { role: "system", content: this.systemPrompt }
    ];

    // 3. Tạo Session ID mới cho mỗi phiên chat mới
    this.SESSION_ID = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // 4. Hiển thị lại tin nhắn chào mặc định ban đầu
    const greeting = "Xin chào! 👋 Tôi là trợ lý AI của chuyên gia F&B cao cấp **Hans Weber**.\nTôi có thể giúp bạn tìm hiểu về các dịch vụ tư vấn nhà hàng, concept ẩm thực, hay các tiêu chuẩn vận hành chuẩn Michelin.\n\nBạn đang quan tâm đến nội dung tư vấn nào ạ?";
    
    this.messages.push({ role: "assistant", content: greeting });
    this.renderMessage(greeting, "bot");

    // 5. Sau đúng 500ms → dừng animation xoay
    setTimeout(() => {
      this.refreshIcon.classList.remove("spin");
      if (!isInit) this.chatInput.focus();
    }, 500);
  }

  handleUserSubmit() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = "";
    this.messages.push({ role: "user", content: text });
    
    this.renderMessage(text, "user");
    this.generateAIResponse();
  }

  renderMessage(text, sender) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", sender);
    
    if (sender === "bot") {
      wrapper.classList.add("chat-markdown");
      wrapper.innerHTML = marked.parse(text);
    } else {
      // Escape HTML for user message
      const div = document.createElement("div");
      div.textContent = text;
      wrapper.innerHTML = div.innerHTML;
    }
    
    this.chatBody.appendChild(wrapper);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  showTyping() {
    this.chatBody.appendChild(this.typingIndicator);
    this.scrollToBottom();
  }

  hideTyping() {
    if (this.typingIndicator.parentNode) {
      this.typingIndicator.parentNode.removeChild(this.typingIndicator);
    }
  }

  // ============================================================
  // LEAD CAPTURE: Bóc tách dữ liệu + Gửi Google Sheets
  // ============================================================

  processAIResponse(aiResponse) {
    if (!aiResponse.includes("||LEAD_DATA:")) {
      return aiResponse;
    }

    const match = aiResponse.match(this.LEAD_PATTERN);
    if (match && match[1]) {
      try {
        const leadData = JSON.parse(match[1]);
        console.log("✅ Dữ liệu khách hàng bóc được:", leadData);
        console.log("🎯 Quan tâm:", leadData.interest, "| Mức độ:", leadData.intent_level);

        if (leadData.name || leadData.phone || leadData.email) {
          this.sendLeadToGoogleSheets(leadData);
        }
      } catch (error) {
        console.error("❌ Lỗi parse JSON từ AI:", error);
      }
    }

    // Xóa tag ẩn khỏi câu trả lời
    return aiResponse.replace(this.LEAD_PATTERN, "").trim();
  }

  async sendLeadToGoogleSheets(leadData) {
    // Xây dựng lịch sử chat dạng text
    const chatHistory = this.messages
      .filter(m => m.role !== "system")
      .map(m => {
        const role = m.role === "user" ? "Khách" : "AI";
        const content = m.content.replace(this.LEAD_PATTERN, "").trim();
        return `${role}: ${content}`;
      })
      .join("\n\n");

    try {
      await fetch(this.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadData.name || "",
          phone: leadData.phone || "",
          email: leadData.email || "",
          interest: leadData.interest || "",
          intent_level: leadData.intent_level || "",
          source: window.location.href,
          sessionId: this.SESSION_ID,
          chatHistory: chatHistory,
          timestamp: new Date().toLocaleString("vi-VN")
        })
      });
      console.log("📤 Đã đồng bộ dữ liệu vào Google Sheets!");
    } catch (err) {
      console.warn("⚠️ Không gửi được dữ liệu lead:", err);
    }
  }

  // ============================================================
  // API Call
  // ============================================================

  async generateAIResponse() {
    this.showTyping();
    this.chatInput.disabled = true;

    try {
      const payload = {
        model: this.MODEL_NAME,
        messages: this.messages
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API Request Failed");

      const data = await response.json();
      let botReply = data.choices[0].message.content;

      // Lưu bản gốc (có tag) vào messages để lịch sử đầy đủ
      this.messages.push({ role: "assistant", content: botReply });

      // Bóc tách lead data + gửi Google Sheets (nếu có)
      const cleanReply = this.processAIResponse(botReply);

      this.hideTyping();
      this.renderMessage(cleanReply, "bot");

    } catch (error) {
      console.error(error);
      this.hideTyping();
      this.renderMessage("Xin lỗi, hệ thống đang bận. Vui lòng gửi email trực tiếp tại archive@hansweber.de nhé!", "bot");
    } finally {
      this.chatInput.disabled = false;
      this.chatInput.focus();
      this.scrollToBottom();
    }
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  window.chatbot = new AIChatbot();
});

class AIChatbot {
  constructor() {
    this.API_KEY = "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";
    this.API_URL = "https://openrouter.ai/api/v1/chat/completions";
    this.MODEL_NAME = "z-ai/glm-4.5-air:free";
    
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

    // 3. Hiển thị lại tin nhắn chào mặc định ban đầu
    const greeting = "Xin chào! 👋 Tôi là trợ lý AI của chuyên gia F&B cao cấp **Hans Weber**.\nTôi có thể giúp bạn tìm hiểu về các dịch vụ tư vấn nhà hàng, concept ẩm thực, hay các tiêu chuẩn vận hành chuẩn Michelin.\n\nBạn đang quan tâm đến nội dung tư vấn nào ạ?";
    
    this.messages.push({ role: "assistant", content: greeting });
    this.renderMessage(greeting, "bot");

    // 4. Sau đúng 500ms → dừng animation xoay
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
      const botReply = data.choices[0].message.content;

      this.messages.push({ role: "assistant", content: botReply });
      this.hideTyping();
      this.renderMessage(botReply, "bot");

    } catch (error) {
      console.error(error);
      this.hideTyping();
      this.renderMessage("Xin lỗi, hệ thống đang bận. Vui lòng gửi email hoặc liên hệ Zalo trực tiếp nhé!", "bot");
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

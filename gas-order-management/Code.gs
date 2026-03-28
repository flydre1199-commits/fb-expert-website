/**
 * Google Apps Script - Order Management Web App
 * Server-side logic: CRUD operations, email notifications
 * 
 * HƯỚNG DẪN: Thay SPREADSHEET_ID bằng ID của Google Sheets của bạn.
 * ID nằm trong URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
 */

// ===================== CẤU HÌNH =====================
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- Thay bằng ID thực tế

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ===================== WEB APP =====================
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Quản Lý Đơn Hàng')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ===================== HELPER =====================
function generateId(prefix) {
  return prefix + '_' + new Date().getTime();
}

// ===================== CUSTOMERS CRUD =====================
function getCustomers() {
  try {
    var sheet = getSpreadsheet().getSheetByName('Customers');
    var data = sheet.getDataRange().getValues();
    var customers = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] !== '') {
        customers.push({
          id: data[i][0],
          name: data[i][1],
          phone: data[i][2],
          memberLevel: data[i][3]
        });
      }
    }
    return customers;
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách khách hàng: ' + e.message);
  }
}

function addCustomer(name, phone, memberLevel) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Customers');
    var id = generateId('CUS');
    sheet.appendRow([id, name, phone, memberLevel]);
    return { success: true, message: 'Thêm khách hàng thành công!', id: id };
  } catch (e) {
    throw new Error('Lỗi khi thêm khách hàng: ' + e.message);
  }
}

function updateCustomer(id, name, phone, memberLevel) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Customers');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.getRange(i + 1, 2).setValue(name);
        sheet.getRange(i + 1, 3).setValue(phone);
        sheet.getRange(i + 1, 4).setValue(memberLevel);
        return { success: true, message: 'Cập nhật khách hàng thành công!' };
      }
    }
    throw new Error('Không tìm thấy khách hàng với ID: ' + id);
  } catch (e) {
    throw new Error('Lỗi khi cập nhật khách hàng: ' + e.message);
  }
}

function deleteCustomer(id) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Customers');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Xóa khách hàng thành công!' };
      }
    }
    throw new Error('Không tìm thấy khách hàng với ID: ' + id);
  } catch (e) {
    throw new Error('Lỗi khi xóa khách hàng: ' + e.message);
  }
}

// ===================== PRODUCTS CRUD =====================
function getProducts() {
  try {
    var sheet = getSpreadsheet().getSheetByName('Products');
    var data = sheet.getDataRange().getValues();
    var products = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] !== '') {
        products.push({
          id: data[i][0],
          name: data[i][1],
          price: data[i][2]
        });
      }
    }
    return products;
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách sản phẩm: ' + e.message);
  }
}

function addProduct(name, price) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Products');
    var id = generateId('PRD');
    sheet.appendRow([id, name, parseFloat(price)]);
    return { success: true, message: 'Thêm sản phẩm thành công!', id: id };
  } catch (e) {
    throw new Error('Lỗi khi thêm sản phẩm: ' + e.message);
  }
}

function updateProduct(id, name, price) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Products');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.getRange(i + 1, 2).setValue(name);
        sheet.getRange(i + 1, 3).setValue(parseFloat(price));
        return { success: true, message: 'Cập nhật sản phẩm thành công!' };
      }
    }
    throw new Error('Không tìm thấy sản phẩm với ID: ' + id);
  } catch (e) {
    throw new Error('Lỗi khi cập nhật sản phẩm: ' + e.message);
  }
}

function deleteProduct(id) {
  try {
    var sheet = getSpreadsheet().getSheetByName('Products');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Xóa sản phẩm thành công!' };
      }
    }
    throw new Error('Không tìm thấy sản phẩm với ID: ' + id);
  } catch (e) {
    throw new Error('Lỗi khi xóa sản phẩm: ' + e.message);
  }
}

// ===================== ORDERS =====================
function getOrders() {
  try {
    var ss = getSpreadsheet();
    var orderSheet = ss.getSheetByName('Orders');
    var customerSheet = ss.getSheetByName('Customers');
    var productSheet = ss.getSheetByName('Products');

    var orderData = orderSheet.getDataRange().getValues();
    var customerData = customerSheet.getDataRange().getValues();
    var productData = productSheet.getDataRange().getValues();

    // Build lookup maps
    var customerMap = {};
    for (var c = 1; c < customerData.length; c++) {
      customerMap[customerData[c][0]] = customerData[c][1];
    }

    var productMap = {};
    for (var p = 1; p < productData.length; p++) {
      productMap[productData[p][0]] = productData[p][1];
    }

    var orders = [];
    for (var i = 1; i < orderData.length; i++) {
      if (orderData[i][0] !== '') {
        orders.push({
          orderId: orderData[i][0],
          customerId: orderData[i][1],
          customerName: customerMap[orderData[i][1]] || orderData[i][1],
          productId: orderData[i][2],
          productName: productMap[orderData[i][2]] || orderData[i][2],
          quantity: orderData[i][3],
          totalAmount: orderData[i][4],
          status: orderData[i][5],
          createdAt: orderData[i][6] ? Utilities.formatDate(new Date(orderData[i][6]), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss') : ''
        });
      }
    }
    return orders;
  } catch (e) {
    throw new Error('Lỗi khi lấy danh sách đơn hàng: ' + e.message);
  }
}

function createOrder(customerId, productId, quantity) {
  try {
    var ss = getSpreadsheet();
    var orderSheet = ss.getSheetByName('Orders');
    var customerSheet = ss.getSheetByName('Customers');
    var productSheet = ss.getSheetByName('Products');

    // Find customer name
    var customerData = customerSheet.getDataRange().getValues();
    var customerName = '';
    for (var c = 1; c < customerData.length; c++) {
      if (customerData[c][0] === customerId) {
        customerName = customerData[c][1];
        break;
      }
    }
    if (!customerName) {
      throw new Error('Không tìm thấy khách hàng với ID: ' + customerId);
    }

    // Find product info
    var productData = productSheet.getDataRange().getValues();
    var productName = '';
    var productPrice = 0;
    for (var p = 1; p < productData.length; p++) {
      if (productData[p][0] === productId) {
        productName = productData[p][1];
        productPrice = parseFloat(productData[p][2]);
        break;
      }
    }
    if (!productName) {
      throw new Error('Không tìm thấy sản phẩm với ID: ' + productId);
    }

    // Calculate total
    var qty = parseInt(quantity);
    var totalAmount = productPrice * qty;
    var orderId = generateId('ORD');
    var createdAt = new Date();
    var status = 'Mới';

    // Save order
    orderSheet.appendRow([orderId, customerId, productId, qty, totalAmount, status, createdAt]);

    // Send email notification
    var emailResult = sendOrderEmail(orderId, customerName, productName, qty, totalAmount, createdAt);

    return {
      success: true,
      message: 'Tạo đơn hàng thành công!' + (emailResult ? ' Email thông báo đã được gửi.' : ''),
      orderId: orderId
    };
  } catch (e) {
    throw new Error('Lỗi khi tạo đơn hàng: ' + e.message);
  }
}

// ===================== EMAIL =====================
function sendOrderEmail(orderId, customerName, productName, quantity, totalAmount, createdAt) {
  try {
    var ss = getSpreadsheet();
    var deptSheet = ss.getSheetByName('Departments');
    var deptData = deptSheet.getDataRange().getValues();

    // Collect all emails from Departments
    var allEmails = [];
    for (var i = 1; i < deptData.length; i++) {
      var emailStr = deptData[i][2]; // Column Emails
      if (emailStr && emailStr.toString().trim() !== '') {
        var emails = emailStr.toString().split(',');
        for (var j = 0; j < emails.length; j++) {
          var email = emails[j].trim();
          if (email !== '' && allEmails.indexOf(email) === -1) {
            allEmails.push(email);
          }
        }
      }
    }

    if (allEmails.length === 0) {
      Logger.log('Không có email nào trong Departments để gửi thông báo.');
      return false;
    }

    var formattedDate = Utilities.formatDate(new Date(createdAt), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    var formattedTotal = new Intl.NumberFormat('vi-VN').format(totalAmount) + ' VNĐ';

    var subject = '📦 Đơn hàng mới: ' + orderId;

    var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 12px; overflow: hidden;">'
      + '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">'
      + '<h1 style="color: #fff; margin: 0; font-size: 24px;">🛒 Thông Báo Đơn Hàng Mới</h1>'
      + '</div>'
      + '<div style="padding: 30px;">'
      + '<table style="width: 100%; border-collapse: collapse;">'
      + '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: bold;">Order ID</td>'
      + '<td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #333;">' + orderId + '</td></tr>'
      + '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: bold;">Khách hàng</td>'
      + '<td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #333;">' + customerName + '</td></tr>'
      + '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: bold;">Sản phẩm</td>'
      + '<td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #333;">' + productName + '</td></tr>'
      + '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: bold;">Số lượng</td>'
      + '<td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #333;">' + quantity + '</td></tr>'
      + '<tr><td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #666; font-weight: bold;">Tổng tiền</td>'
      + '<td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; color: #333; font-size: 18px; font-weight: bold; color: #e74c3c;">' + formattedTotal + '</td></tr>'
      + '<tr><td style="padding: 12px 8px; color: #666; font-weight: bold;">Ngày tạo</td>'
      + '<td style="padding: 12px 8px; color: #333;">' + formattedDate + '</td></tr>'
      + '</table>'
      + '</div>'
      + '<div style="background: #f0f0f0; padding: 15px; text-align: center; color: #999; font-size: 12px;">'
      + 'Hệ thống Quản Lý Đơn Hàng - Tự động gửi'
      + '</div>'
      + '</div>';

    MailApp.sendEmail({
      to: allEmails.join(','),
      subject: subject,
      htmlBody: htmlBody
    });

    Logger.log('Email đã gửi thành công đến: ' + allEmails.join(', '));
    return true;
  } catch (e) {
    Logger.log('Lỗi khi gửi email: ' + e.message);
    return false;
  }
}

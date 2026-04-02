/**
 * HỆ THỐNG QUẢN LÝ KHO HÀNG - Google Apps Script
 * ================================================
 * HƯỚNG DẪN: 
 * 1. Mở Google Sheets → Extensions → Apps Script
 * 2. Paste code này vào Code.gs
 * 3. Chạy hàm initializeDatabase() MỘT LẦN để tạo sheets + data mẫu
 * 4. Tạo 3 file HTML: Index, CSS, JavaScript
 * 5. Deploy as Web App
 */

// ==================== CẤU HÌNH ====================
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// ==================== KHỞI TẠO DATABASE ====================
function initializeDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // --- Categories ---
  var catSheet = ss.getSheetByName('Categories') || ss.insertSheet('Categories');
  catSheet.clear();
  catSheet.appendRow(['Cat_ID', 'Cat_Name', 'Description']);
  catSheet.appendRow(['CAT001', 'Văn phòng phẩm', 'Bút, giấy, kẹp, ghim...']);
  catSheet.appendRow(['CAT002', 'Thiết bị IT', 'Laptop, chuột, bàn phím...']);
  catSheet.appendRow(['CAT003', 'Nội thất', 'Bàn, ghế, tủ...']);
  catSheet.appendRow(['CAT004', 'Thiết bị in ấn', 'Máy in, mực in, giấy in...']);
  
  // --- Suppliers ---
  var supSheet = ss.getSheetByName('Suppliers') || ss.insertSheet('Suppliers');
  supSheet.clear();
  supSheet.appendRow(['Supplier_ID', 'Supplier_Name', 'Contact_Person', 'Phone', 'Email', 'Address']);
  supSheet.appendRow(['SUP001', 'Công ty Thiên Long', 'Nguyễn Văn A', '0901111111', 'order@thienlong.vn', 'Q.Tân Phú, TP.HCM']);
  supSheet.appendRow(['SUP002', 'Phong Vũ Trading', 'Trần Thị B', '0902222222', 'sales@phongvu.vn', 'Q.10, TP.HCM']);
  supSheet.appendRow(['SUP003', 'Nội thất Hòa Phát', 'Lê Văn C', '0903333333', 'info@hoaphat.com', 'Q.12, TP.HCM']);
  supSheet.appendRow(['SUP004', 'FPT Shop', 'Hoàng Văn D', '0904444444', 'b2b@fptshop.com', 'Q.Cầu Giấy, Hà Nội']);
  
  // --- Products (10+ sản phẩm) ---
  var prodSheet = ss.getSheetByName('Products') || ss.insertSheet('Products');
  prodSheet.clear();
  prodSheet.appendRow(['Product_ID', 'Product_Name', 'Cat_ID', 'Supplier_ID', 'Unit', 'Unit_Price', 'Min_Stock']);
  prodSheet.appendRow(['SP001', 'Bút bi Thiên Long TL-08', 'CAT001', 'SUP001', 'Cây', 5000, 100]);
  prodSheet.appendRow(['SP002', 'Laptop Dell Vostro 3520', 'CAT002', 'SUP002', 'Cái', 15000000, 5]);
  prodSheet.appendRow(['SP003', 'Ghế xoay văn phòng HP', 'CAT003', 'SUP003', 'Cái', 1800000, 10]);
  prodSheet.appendRow(['SP004', 'Giấy A4 Double A', 'CAT001', 'SUP001', 'Ram', 65000, 50]);
  prodSheet.appendRow(['SP005', 'Mực in HP 107A', 'CAT004', 'SUP002', 'Hộp', 350000, 20]);
  prodSheet.appendRow(['SP006', 'Chuột không dây Logitech M331', 'CAT002', 'SUP002', 'Cái', 350000, 15]);
  prodSheet.appendRow(['SP007', 'Bàn phím cơ Akko 3068B', 'CAT002', 'SUP004', 'Cái', 1200000, 8]);
  prodSheet.appendRow(['SP008', 'Kẹp bướm 51mm', 'CAT001', 'SUP001', 'Hộp', 25000, 30]);
  prodSheet.appendRow(['SP009', 'Tủ hồ sơ 3 ngăn', 'CAT003', 'SUP003', 'Cái', 3200000, 3]);
  prodSheet.appendRow(['SP010', 'Máy in HP LaserJet M211dw', 'CAT004', 'SUP004', 'Cái', 4500000, 3]);
  prodSheet.appendRow(['SP011', 'Bút dạ quang Stabilo', 'CAT001', 'SUP001', 'Cây', 15000, 80]);
  prodSheet.appendRow(['SP012', 'Webcam Logitech C920', 'CAT002', 'SUP002', 'Cái', 1800000, 5]);
  
  // --- Transactions ---
  var transSheet = ss.getSheetByName('Transactions') || ss.insertSheet('Transactions');
  transSheet.clear();
  transSheet.appendRow(['Trans_ID', 'Product_ID', 'Type', 'Quantity', 'Supplier_ID', 'Note', 'Created_By', 'Created_At']);
  transSheet.appendRow(['TXN20260301001', 'SP001', 'Nhập', 500, 'SUP001', 'Nhập lô Q1/2026', 'Admin', new Date(2026, 2, 1)]);
  transSheet.appendRow(['TXN20260301002', 'SP004', 'Nhập', 200, 'SUP001', 'Nhập giấy A4 lô mới', 'Admin', new Date(2026, 2, 1)]);
  transSheet.appendRow(['TXN20260305001', 'SP001', 'Xuất', 50, '', 'Bán cho KH công ty X', 'Admin', new Date(2026, 2, 5)]);
  transSheet.appendRow(['TXN20260305002', 'SP002', 'Nhập', 10, 'SUP002', 'Nhập laptop mới', 'Admin', new Date(2026, 2, 5)]);
  transSheet.appendRow(['TXN20260310001', 'SP003', 'Nhập', 20, 'SUP003', 'Nhập ghế văn phòng', 'Admin', new Date(2026, 2, 10)]);
  transSheet.appendRow(['TXN20260310002', 'SP005', 'Nhập', 50, 'SUP002', 'Nhập mực in HP', 'Admin', new Date(2026, 2, 10)]);
  transSheet.appendRow(['TXN20260315001', 'SP002', 'Xuất', 3, '', 'Xuất cho phòng Marketing', 'Admin', new Date(2026, 2, 15)]);
  transSheet.appendRow(['TXN20260315002', 'SP006', 'Nhập', 30, 'SUP002', 'Nhập chuột Logitech', 'Admin', new Date(2026, 2, 15)]);
  transSheet.appendRow(['TXN20260320001', 'SP004', 'Xuất', 100, '', 'Xuất giấy cho phòng HC', 'Admin', new Date(2026, 2, 20)]);
  transSheet.appendRow(['TXN20260320002', 'SP007', 'Nhập', 15, 'SUP004', 'Nhập bàn phím cơ', 'Admin', new Date(2026, 2, 20)]);
  transSheet.appendRow(['TXN20260325001', 'SP008', 'Nhập', 50, 'SUP001', 'Nhập kẹp bướm', 'Admin', new Date(2026, 2, 25)]);
  transSheet.appendRow(['TXN20260325002', 'SP009', 'Nhập', 5, 'SUP003', 'Nhập tủ hồ sơ', 'Admin', new Date(2026, 2, 25)]);
  transSheet.appendRow(['TXN20260328001', 'SP010', 'Nhập', 5, 'SUP004', 'Nhập máy in HP', 'Admin', new Date(2026, 2, 28)]);
  transSheet.appendRow(['TXN20260328002', 'SP011', 'Nhập', 100, 'SUP001', 'Nhập bút dạ quang', 'Admin', new Date(2026, 2, 28)]);
  transSheet.appendRow(['TXN20260401001', 'SP012', 'Nhập', 10, 'SUP002', 'Nhập webcam', 'Admin', new Date(2026, 3, 1)]);
  transSheet.appendRow(['TXN20260401002', 'SP001', 'Xuất', 200, '', 'Xuất bút cho đại lý', 'Admin', new Date(2026, 3, 1)]);
  
  // --- Warehouses ---
  var whSheet = ss.getSheetByName('Warehouses') || ss.insertSheet('Warehouses');
  whSheet.clear();
  whSheet.appendRow(['Warehouse_ID', 'Warehouse_Name', 'Location', 'Manager']);
  whSheet.appendRow(['WH001', 'Kho chính', 'Q.Bình Thạnh, TP.HCM', 'Nguyễn Văn D']);
  whSheet.appendRow(['WH002', 'Kho phụ', 'Q.Thủ Đức, TP.HCM', 'Trần Văn E']);
  
  // --- AlertRecipients ---
  var alertSheet = ss.getSheetByName('AlertRecipients') || ss.insertSheet('AlertRecipients');
  alertSheet.clear();
  alertSheet.appendRow(['Email', 'Role', 'Active']);
  alertSheet.appendRow(['manager@company.com', 'Quản lý kho', true]);
  alertSheet.appendRow(['purchasing@company.com', 'Bộ phận mua hàng', true]);
  alertSheet.appendRow(['director@company.com', 'Giám đốc', false]);
  
  // --- Users ---
  var userSheet = ss.getSheetByName('Users') || ss.insertSheet('Users');
  userSheet.clear();
  userSheet.appendRow(['User_ID', 'Email', 'Password', 'Full_Name', 'Role', 'Active']);
  userSheet.appendRow(['U001', 'admin@gmail.com', '123456', 'Nguyễn Admin', 'admin', true]);
  userSheet.appendRow(['U002', 'kho1@gmail.com', '123456', 'Trần Thủ Kho', 'warehouse_staff', true]);
  userSheet.appendRow(['U003', 'viewer@gmail.com', '123456', 'Lê Nhân Viên', 'viewer', true]);
  userSheet.appendRow(['U004', 'nghiviec@gmail.com', '123456', 'Phạm Đã Nghỉ', 'warehouse_staff', false]);
  
  // Xóa sheet mặc định nếu có
  var defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (defaultSheet && ss.getSheets().length > 7) {
    ss.deleteSheet(defaultSheet);
  }
  
  Logger.log('✅ Database đã được khởi tạo thành công!');
  Logger.log('Spreadsheet ID: ' + ss.getId());
}

// ==================== WEB APP ====================
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Hệ Thống Quản Lý Kho Hàng')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ==================== HELPERS ====================
function isActive(val) {
  return val === true || String(val).toUpperCase() === 'TRUE';
}

function generateNextId(sheetName, prefix, colIndex) {
  var data = getSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var max = 0;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][colIndex || 0]);
    if (id.indexOf(prefix) === 0) {
      var n = parseInt(id.substring(prefix.length)) || 0;
      if (n > max) max = n;
    }
  }
  var next = String(max + 1);
  while (next.length < 3) next = '0' + next;
  return prefix + next;
}

function calculateAllStock() {
  var data = getSpreadsheet().getSheetByName('Transactions').getDataRange().getValues();
  var map = {};
  for (var i = 1; i < data.length; i++) {
    var pid = data[i][1], type = data[i][2], qty = parseInt(data[i][3]) || 0;
    if (!map[pid]) map[pid] = 0;
    if (type === 'Nhập') map[pid] += qty;
    else if (type === 'Xuất') map[pid] -= qty;
  }
  return map;
}

function generateTransId() {
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  var prefix = 'TXN' + dateStr;
  var data = getSpreadsheet().getSheetByName('Transactions').getDataRange().getValues();
  var max = 0;
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][0]);
    if (id.indexOf(prefix) === 0) {
      var n = parseInt(id.substring(prefix.length)) || 0;
      if (n > max) max = n;
    }
  }
  var next = String(max + 1);
  while (next.length < 3) next = '0' + next;
  return prefix + next;
}

// ==================== AUTH ====================
function checkLogin(email, password) {
  try {
    var data = getSpreadsheet().getSheetByName('Users').getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase().trim() === email.toLowerCase().trim()) {
        if (String(data[i][2]) !== password) return { error: true, message: 'Mật khẩu không đúng' };
        if (!isActive(data[i][5])) return { error: true, message: 'Tài khoản đã bị vô hiệu hóa' };
        return { userId: data[i][0], email: data[i][1], fullName: data[i][3], role: data[i][4], active: true };
      }
    }
    return { error: true, message: 'Email không tồn tại trong hệ thống' };
  } catch (e) {
    return { error: true, message: 'Lỗi hệ thống: ' + e.message };
  }
}

function getUserByEmail(email) {
  var data = getSpreadsheet().getSheetByName('Users').getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase().trim() === email.toLowerCase().trim() && isActive(data[i][5])) {
      return { userId: data[i][0], email: data[i][1], fullName: data[i][3], role: data[i][4] };
    }
  }
  return null;
}

function checkPerm(email, roles) {
  var user = getUserByEmail(email);
  if (!user) throw new Error('Không có quyền truy cập');
  if (roles.indexOf(user.role) === -1) throw new Error('Bạn không có quyền thực hiện thao tác này');
  return user;
}

// ==================== CATEGORIES ====================
function getCategories(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var data = getSpreadsheet().getSheetByName('Categories').getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) list.push({ id: data[i][0], name: data[i][1], desc: data[i][2] });
  }
  return list;
}

// ==================== SUPPLIERS ====================
function getSuppliers(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var data = getSpreadsheet().getSheetByName('Suppliers').getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) list.push({
      id: data[i][0], name: data[i][1], contact: data[i][2],
      phone: data[i][3], email: data[i][4], address: data[i][5]
    });
  }
  return list;
}

function addSupplier(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Suppliers');
  var id = generateNextId('Suppliers', 'SUP');
  sheet.appendRow([id, d.name, d.contact, d.phone, d.email, d.address]);
  return { success: true, message: 'Thêm NCC thành công!' };
}

function updateSupplier(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Suppliers');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === d.id) {
      sheet.getRange(i+1, 2, 1, 5).setValues([[d.name, d.contact, d.phone, d.email, d.address]]);
      return { success: true, message: 'Cập nhật NCC thành công!' };
    }
  }
  throw new Error('Không tìm thấy NCC');
}

function deleteSupplier(id, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Suppliers');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sheet.deleteRow(i+1); return { success: true, message: 'Xóa NCC thành công!' }; }
  }
  throw new Error('Không tìm thấy NCC');
}

// ==================== PRODUCTS ====================
function getProducts(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var ss = getSpreadsheet();
  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var cData = ss.getSheetByName('Categories').getDataRange().getValues();
  var sData = ss.getSheetByName('Suppliers').getDataRange().getValues();
  var stockMap = calculateAllStock();

  var catMap = {}, supMap = {};
  for (var i = 1; i < cData.length; i++) catMap[cData[i][0]] = cData[i][1];
  for (var i = 1; i < sData.length; i++) supMap[sData[i][0]] = sData[i][1];

  var list = [];
  for (var i = 1; i < pData.length; i++) {
    if (!pData[i][0]) continue;
    var pid = pData[i][0], stock = stockMap[pid] || 0, min = pData[i][6] || 0;
    var status = stock <= min ? 'critical' : stock <= min * 1.5 ? 'warning' : 'good';
    list.push({
      id: pid, name: pData[i][1], catId: pData[i][2], catName: catMap[pData[i][2]] || '',
      supplierId: pData[i][3], supplierName: supMap[pData[i][3]] || '',
      unit: pData[i][4], unitPrice: pData[i][5], minStock: min, currentStock: stock, status: status
    });
  }
  return list;
}

function addProduct(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var id = generateNextId('Products', 'SP');
  getSpreadsheet().getSheetByName('Products').appendRow([id, d.name, d.catId, d.supplierId, d.unit, parseFloat(d.unitPrice), parseInt(d.minStock)]);
  return { success: true, message: 'Thêm sản phẩm thành công!' };
}

function updateProduct(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Products');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === d.id) {
      sheet.getRange(i+1, 2, 1, 6).setValues([[d.name, d.catId, d.supplierId, d.unit, parseFloat(d.unitPrice), parseInt(d.minStock)]]);
      return { success: true, message: 'Cập nhật sản phẩm thành công!' };
    }
  }
  throw new Error('Không tìm thấy sản phẩm');
}

function deleteProduct(id, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Products');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) { sheet.deleteRow(i+1); return { success: true, message: 'Xóa sản phẩm thành công!' }; }
  }
  throw new Error('Không tìm thấy sản phẩm');
}

// ==================== TRANSACTIONS ====================
function getTransactions(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var ss = getSpreadsheet();
  var data = ss.getSheetByName('Transactions').getDataRange().getValues();
  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var pMap = {};
  for (var i = 1; i < pData.length; i++) pMap[pData[i][0]] = pData[i][1];

  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      transId: data[i][0], productId: data[i][1], productName: pMap[data[i][1]] || data[i][1],
      type: data[i][2], quantity: data[i][3], supplierId: data[i][4],
      note: data[i][5], createdBy: data[i][6],
      createdAt: data[i][7] ? Utilities.formatDate(new Date(data[i][7]), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : ''
    });
  }
  list.reverse();
  return list.slice(0, 20);
}

function createTransaction(d, userEmail) {
  var user = checkPerm(userEmail, ['admin', 'warehouse_staff']);
  var ss = getSpreadsheet();
  var qty = parseInt(d.quantity);
  if (!qty || qty <= 0) throw new Error('Số lượng phải > 0');

  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var product = null;
  for (var i = 1; i < pData.length; i++) {
    if (pData[i][0] === d.productId) { product = { minStock: pData[i][6], unit: pData[i][4], name: pData[i][1] }; break; }
  }
  if (!product) throw new Error('Sản phẩm không tồn tại');

  var stockMap = calculateAllStock();
  var currentStock = stockMap[d.productId] || 0;

  if (d.type === 'Xuất') {
    if (currentStock < qty) throw new Error('Tồn kho chỉ còn ' + currentStock + ' ' + product.unit + ', không thể xuất ' + qty);
  }

  var transId = generateTransId();
  var supplierId = d.type === 'Nhập' ? d.supplierId : '';
  ss.getSheetByName('Transactions').appendRow([transId, d.productId, d.type, qty, supplierId, d.note || '', user.fullName, new Date()]);

  var msg = 'Tạo phiếu ' + d.type + ' kho thành công!';
  if (d.type === 'Xuất') {
    var newStock = currentStock - qty;
    if (newStock <= product.minStock) {
      try {
        sendAutoAlertForProduct(d.productId);
        msg += ' ⚠️ Đã gửi cảnh báo tồn kho thấp tự động.';
      } catch (e) {
        msg += ' (Cảnh báo email thất bại: ' + e.message + ')';
      }
    }
  }
  return { success: true, message: msg };
}

function getProductStock(productId, userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var stockMap = calculateAllStock();
  return stockMap[productId] || 0;
}

// ==================== DASHBOARD ====================
function getDashboardData(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var ss = getSpreadsheet();
  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var tData = ss.getSheetByName('Transactions').getDataRange().getValues();
  var cData = ss.getSheetByName('Categories').getDataRange().getValues();
  var stockMap = calculateAllStock();

  var catMap = {};
  for (var i = 1; i < cData.length; i++) catMap[cData[i][0]] = cData[i][1];

  var now = new Date(), thisMonth = now.getMonth(), thisYear = now.getFullYear();
  var monthTx = 0;
  for (var i = 1; i < tData.length; i++) {
    try { var dt = new Date(tData[i][7]); if (dt.getMonth() === thisMonth && dt.getFullYear() === thisYear) monthTx++; } catch(e) {}
  }

  var totalProducts = 0, lowStock = 0, totalValue = 0;
  var catStock = {}, prodList = [];
  for (var i = 1; i < pData.length; i++) {
    if (!pData[i][0]) continue;
    totalProducts++;
    var pid = pData[i][0], stock = stockMap[pid] || 0, min = pData[i][6] || 0, price = pData[i][5] || 0;
    var cn = catMap[pData[i][2]] || pData[i][2];
    if (stock <= min) lowStock++;
    totalValue += stock * price;
    if (!catStock[cn]) catStock[cn] = 0;
    catStock[cn] += stock;
    prodList.push({ name: pData[i][1], stock: stock });
  }

  prodList.sort(function(a,b) { return b.stock - a.stock; });
  var pie = [['Danh mục', 'Tồn kho']];
  for (var k in catStock) pie.push([k, catStock[k]]);
  var bar = [['Sản phẩm', 'Tồn kho']];
  for (var j = 0; j < Math.min(5, prodList.length); j++) bar.push([prodList[j].name, prodList[j].stock]);

  return { totalProducts: totalProducts, monthlyTx: monthTx, lowStock: lowStock, totalValue: totalValue, pieData: pie, barData: bar };
}

// ==================== ALERTS ====================
function getLowStockProducts(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff', 'viewer']);
  var ss = getSpreadsheet();
  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var sData = ss.getSheetByName('Suppliers').getDataRange().getValues();
  var stockMap = calculateAllStock();
  var supMap = {};
  for (var i = 1; i < sData.length; i++) supMap[sData[i][0]] = { name: sData[i][1], phone: sData[i][3] };

  var list = [];
  for (var i = 1; i < pData.length; i++) {
    if (!pData[i][0]) continue;
    var stock = stockMap[pData[i][0]] || 0, min = pData[i][6] || 0;
    if (stock <= min) {
      var sup = supMap[pData[i][3]] || {};
      list.push({ id: pData[i][0], name: pData[i][1], unit: pData[i][4], currentStock: stock, minStock: min, supplierName: sup.name || '', supplierPhone: sup.phone || '' });
    }
  }
  return list;
}

function sendLowStockAlert(userEmail) {
  checkPerm(userEmail, ['admin', 'warehouse_staff']);
  var ss = getSpreadsheet();
  var products = getLowStockProducts(userEmail);
  if (products.length === 0) return { success: true, message: 'Không có sản phẩm nào cần cảnh báo.' };

  var alertData = ss.getSheetByName('AlertRecipients').getDataRange().getValues();
  var emails = [];
  for (var i = 1; i < alertData.length; i++) {
    if (isActive(alertData[i][2]) && String(alertData[i][0]).trim()) emails.push(String(alertData[i][0]).trim());
  }
  if (emails.length === 0) return { success: false, message: 'Không có email nhận cảnh báo nào đang Active.' };

  var rows = '';
  for (var j = 0; j < products.length; j++) {
    var p = products[j];
    rows += '<tr><td style="padding:10px;border:1px solid #ddd">' + p.id + '</td><td style="padding:10px;border:1px solid #ddd">' + p.name + '</td><td style="padding:10px;border:1px solid #ddd;color:#e74c3c;font-weight:bold">' + p.currentStock + ' ' + p.unit + '</td><td style="padding:10px;border:1px solid #ddd">' + p.minStock + ' ' + p.unit + '</td><td style="padding:10px;border:1px solid #ddd">' + p.supplierName + ' - ' + p.supplierPhone + '</td></tr>';
  }
  var html = '<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto"><div style="background:linear-gradient(135deg,#e74c3c,#c0392b);padding:20px;text-align:center;border-radius:8px 8px 0 0"><h2 style="color:#fff;margin:0">⚠️ CẢNH BÁO TỒN KHO THẤP</h2></div><div style="padding:20px;background:#f8f9fa"><p>Có <strong>' + products.length + '</strong> sản phẩm có tồn kho dưới mức tối thiểu:</p><table style="width:100%;border-collapse:collapse;background:#fff"><thead><tr style="background:#34495e;color:#fff"><th style="padding:10px;text-align:left">Mã SP</th><th style="padding:10px">Tên SP</th><th style="padding:10px">Tồn kho</th><th style="padding:10px">Min</th><th style="padding:10px">NCC</th></tr></thead><tbody>' + rows + '</tbody></table><p style="margin-top:16px;color:#666">Vui lòng liên hệ nhà cung cấp để đặt hàng bổ sung!</p></div><div style="background:#ecf0f1;padding:10px;text-align:center;font-size:12px;color:#999;border-radius:0 0 8px 8px">Hệ thống Quản lý Kho — Thông báo tự động</div></div>';
  MailApp.sendEmail({ to: emails.join(','), subject: '⚠️ Cảnh báo tồn kho thấp - ' + products.length + ' sản phẩm', htmlBody: html });
  return { success: true, message: 'Đã gửi cảnh báo đến ' + emails.length + ' email thành công!' };
}

function sendAutoAlertForProduct(productId) {
  var ss = getSpreadsheet();
  var pData = ss.getSheetByName('Products').getDataRange().getValues();
  var cData = ss.getSheetByName('Categories').getDataRange().getValues();
  var sData = ss.getSheetByName('Suppliers').getDataRange().getValues();
  var stockMap = calculateAllStock();
  var product = null, catName = '', supName = '', supPhone = '';
  for (var i = 1; i < pData.length; i++) { if (pData[i][0] === productId) { product = pData[i]; break; } }
  if (!product) return;
  for (var i = 1; i < cData.length; i++) { if (cData[i][0] === product[2]) { catName = cData[i][1]; break; } }
  for (var i = 1; i < sData.length; i++) { if (sData[i][0] === product[3]) { supName = sData[i][1]; supPhone = sData[i][3]; break; } }

  var alertData = ss.getSheetByName('AlertRecipients').getDataRange().getValues();
  var emails = [];
  for (var i = 1; i < alertData.length; i++) { if (isActive(alertData[i][2]) && String(alertData[i][0]).trim()) emails.push(String(alertData[i][0]).trim()); }
  if (emails.length === 0) return;

  var stock = stockMap[productId] || 0;
  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;border-radius:8px;overflow:hidden"><div style="background:linear-gradient(135deg,#e74c3c,#c0392b);padding:24px;text-align:center"><h2 style="color:#fff;margin:0">⚠️ CẢNH BÁO TỒN KHO THẤP</h2></div><div style="padding:24px"><table style="width:100%"><tr><td style="padding:8px;color:#666;font-weight:bold">Sản phẩm:</td><td style="padding:8px">' + product[1] + ' (Mã: ' + productId + ')</td></tr><tr><td style="padding:8px;color:#666;font-weight:bold">Danh mục:</td><td style="padding:8px">' + catName + '</td></tr><tr><td style="padding:8px;color:#666;font-weight:bold">Tồn kho hiện tại:</td><td style="padding:8px;color:#e74c3c;font-weight:bold">' + stock + ' ' + product[4] + '</td></tr><tr><td style="padding:8px;color:#666;font-weight:bold">Mức tối thiểu:</td><td style="padding:8px">' + product[6] + ' ' + product[4] + '</td></tr><tr><td style="padding:8px;color:#666;font-weight:bold">Nhà cung cấp:</td><td style="padding:8px">' + supName + ' - SĐT: ' + supPhone + '</td></tr></table><p style="margin-top:16px">Vui lòng liên hệ nhà cung cấp để đặt hàng bổ sung!</p></div><div style="background:#ecf0f1;padding:10px;text-align:center;font-size:12px;color:#999">Hệ thống Quản lý Kho — Thông báo tự động</div></div>';
  MailApp.sendEmail({ to: emails.join(','), subject: '⚠️ Cảnh báo tồn kho thấp - ' + product[1], htmlBody: html });
}

// ==================== USERS ====================
function getUsers(userEmail) {
  checkPerm(userEmail, ['admin']);
  var data = getSpreadsheet().getSheetByName('Users').getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) list.push({ userId: data[i][0], email: data[i][1], fullName: data[i][3], role: data[i][4], active: isActive(data[i][5]) });
  }
  return list;
}

function addUser(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Users');
  var id = generateNextId('Users', 'U');
  sheet.appendRow([id, d.email, d.password || '123456', d.fullName, d.role, true]);
  return { success: true, message: 'Thêm người dùng thành công!' };
}

function updateUser(d, userEmail) {
  checkPerm(userEmail, ['admin']);
  var sheet = getSpreadsheet().getSheetByName('Users');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === d.userId) {
      sheet.getRange(i+1, 4).setValue(d.fullName);
      sheet.getRange(i+1, 5).setValue(d.role);
      sheet.getRange(i+1, 6).setValue(d.active);
      return { success: true, message: 'Cập nhật người dùng thành công!' };
    }
  }
  throw new Error('Không tìm thấy người dùng');
}

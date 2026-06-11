// ============================================================
// 农药数字监管分系统 Mock 数据 - 数据闭环版本
// 所有模块数据通过 ID/名称 互相关联，形成完整数据链路
// ============================================================

// --------------- 农药登记证（产品基础数据） ---------------
export const pesticideRegistrations = [
  { regNo: 'PD20101001', name: '草甘膦水剂', form: '水剂', toxicity: '低毒', content: '41%', expiry: '2027-06-30', category: '除草剂', status: '有效' as const },
  { regNo: 'PD20101002', name: '吡虫啉可湿性粉剂', form: '可湿性粉剂', toxicity: '中等毒', content: '10%', expiry: '2026-08-15', category: '杀虫剂', status: '有效' as const },
  { regNo: 'PD20101003', name: '戊唑醇悬浮剂', form: '悬浮剂', toxicity: '低毒', content: '25%', expiry: '2028-03-20', category: '杀菌剂', status: '有效' as const },
  { regNo: 'PD20101004', name: '百菌清可湿性粉剂', form: '可湿性粉剂', toxicity: '低毒', content: '75%', expiry: '2026-07-10', category: '杀菌剂', status: '即将到期' as const },
  { regNo: 'PD20101005', name: '毒死蜱乳油', form: '乳油', toxicity: '中等毒', content: '48%', expiry: '2027-12-31', category: '杀虫剂', status: '有效' as const },
  { regNo: 'PD20101006', name: '草铵膦水剂', form: '水剂', toxicity: '低毒', content: '20%', expiry: '2025-12-01', category: '除草剂', status: '已过期' as const },
  { regNo: 'PD20101007', name: '多菌灵可湿性粉剂', form: '可湿性粉剂', toxicity: '低毒', content: '50%', expiry: '2028-06-30', category: '杀菌剂', status: '有效' as const },
  { regNo: 'PD20101008', name: '阿维菌素乳油', form: '乳油', toxicity: '中等毒', content: '1.8%', expiry: '2027-09-15', category: '杀虫剂', status: '有效' as const },
];

// 产品简表（用于台账等页面引用）
export const productionProducts = pesticideRegistrations.filter(p => p.status !== '已过期');

// --------------- 生产企业 ---------------
export const productionEnterprises = [
  { id: '1', name: '安徽农药化工集团有限公司', type: '原药+制剂', licenseNo: 'WP-3400001', licenseExpiry: '2027-06-30', status: '正常' as const, region: '蚌埠市怀远县', legalPerson: '王总', phone: '0552-401****', address: '怀远工业园区化工路1号', creditCode: '91340300MA2X8****', licenseScope: '原药合成、制剂加工', licenseIssuer: '安徽省农业农村厅', licenseStart: '2022-06-30', creditGrade: 'A', productRegNos: ['PD20101001', 'PD20101002', 'PD20101003'] },
  { id: '2', name: '合肥生物科技公司', type: '制剂', licenseNo: 'WP-3401001', licenseExpiry: '2026-05-30', status: '临期' as const, region: '合肥市蜀山区', legalPerson: '李明', phone: '0551-636****', address: '蜀山区创新大道88号', creditCode: '91340100MA2X9****', licenseScope: '制剂加工', licenseIssuer: '安徽省农业农村厅', licenseStart: '2022-05-30', creditGrade: 'B', productRegNos: ['PD20101001', 'PD20101004'] },
  { id: '3', name: '蚌埠农化股份公司', type: '原药', licenseNo: 'WP-3403001', licenseExpiry: '2028-03-15', status: '正常' as const, region: '蚌埠市禹会区', legalPerson: '赵强', phone: '0552-312****', address: '禹会区工业园纬二路6号', creditCode: '91340300MA2Y0****', licenseScope: '原药合成', licenseIssuer: '安徽省农业农村厅', licenseStart: '2023-03-15', creditGrade: 'A', productRegNos: ['PD20101003', 'PD20101005'] },
  { id: '4', name: '阜阳农药厂', type: '制剂', licenseNo: 'WP-3408001', licenseExpiry: '2026-07-15', status: '正常' as const, region: '阜阳市颍州区', legalPerson: '孙伟', phone: '0558-225****', address: '颍州区农药产业园3号', creditCode: '91340800MA2Y1****', licenseScope: '制剂加工、分装', licenseIssuer: '安徽省农业农村厅', licenseStart: '2022-07-15', creditGrade: 'A', productRegNos: ['PD20101004', 'PD20101007'] },
  { id: '5', name: '宿州农化科技有限公司', type: '原药+制剂', licenseNo: 'WP-3413001', licenseExpiry: '2029-01-20', status: '正常' as const, region: '宿州市埇桥区', legalPerson: '钱华', phone: '0557-302****', address: '埇桥区化工集中区A座', creditCode: '91341300MA2Y2****', licenseScope: '原药合成、制剂加工', licenseIssuer: '安徽省农业农村厅', licenseStart: '2024-01-20', creditGrade: 'A', productRegNos: ['PD20101005', 'PD20101008'] },
  { id: '6', name: '滁州植保科技公司', type: '制剂', licenseNo: 'WP-3411001', licenseExpiry: '2026-03-10', status: '过期' as const, region: '滁州市琅琊区', legalPerson: '吴斌', phone: '0550-305****', address: '琅琊区工业园B区', creditCode: '91341100MA2Y3****', licenseScope: '制剂加工', licenseIssuer: '安徽省农业农村厅', licenseStart: '2021-03-10', creditGrade: 'C', productRegNos: ['PD20101001'] },
  { id: '7', name: '六安农化有限责任公司', type: '原药', licenseNo: 'WP-3415001', licenseExpiry: '2027-09-25', status: '正常' as const, region: '六安市金安区', legalPerson: '郑磊', phone: '0564-321****', address: '金安区化工路12号', creditCode: '91341500MA2Y4****', licenseScope: '原药合成', licenseIssuer: '安徽省农业农村厅', licenseStart: '2023-09-25', creditGrade: 'B', productRegNos: ['PD20101003'] },
  { id: '8', name: '亳州中药材农药公司', type: '制剂', licenseNo: 'WP-3416001', licenseExpiry: '2026-11-30', status: '整改中' as const, region: '亳州市谯城区', legalPerson: '冯涛', phone: '0558-551****', address: '谯城区药都大道99号', creditCode: '91341600MA2Y5****', licenseScope: '制剂加工', licenseIssuer: '安徽省农业农村厅', licenseStart: '2022-11-30', creditGrade: 'C', productRegNos: ['PD20101002', 'PD20101007'] },
];

// --------------- 生产台账（关联生产企业ID + 登记证号） ---------------
export const productionLedger = [
  { batchNo: 'PC-001*01', productName: '草甘膦水剂', regNo: 'PD20101001', date: '2026-06-01', output: 50, sold: 45, stock: 5, status: '正常' as const, enterpriseId: '1', enterprise: '安徽农药化工集团有限公司' },
  { batchNo: 'PC-001*02', productName: '草甘膦水剂', regNo: 'PD20101001', date: '2026-06-03', output: 48, sold: 48, stock: 0, status: '正常' as const, enterpriseId: '1', enterprise: '安徽农药化工集团有限公司' },
  { batchNo: 'PC-001*03', productName: '吡虫啉可湿性粉剂', regNo: 'PD20101002', date: '2026-06-05', output: 30, sold: 25, stock: 5, status: '正常' as const, enterpriseId: '1', enterprise: '安徽农药化工集团有限公司' },
  { batchNo: 'PC-002*01', productName: '戊唑醇悬浮剂', regNo: 'PD20101003', date: '2026-06-02', output: 40, sold: 35, stock: 5, status: '临期' as const, enterpriseId: '3', enterprise: '蚌埠农化股份公司' },
  { batchNo: 'PC-003*01', productName: '百菌清可湿性粉剂', regNo: 'PD20101004', date: '2026-06-04', output: 25, sold: 20, stock: 5, status: '正常' as const, enterpriseId: '4', enterprise: '阜阳农药厂' },
  { batchNo: 'PC-004*01', productName: '毒死蜱乳油', regNo: 'PD20101005', date: '2026-06-06', output: 35, sold: 30, stock: 5, status: '正常' as const, enterpriseId: '5', enterprise: '宿州农化科技有限公司' },
  { batchNo: 'PC-001*04', productName: '草甘膦水剂', regNo: 'PD20101001', date: '2026-06-07', output: 55, sold: 0, stock: 55, status: '正常' as const, enterpriseId: '1', enterprise: '安徽农药化工集团有限公司' },
  { batchNo: 'PC-005*01', productName: '戊唑醇悬浮剂', regNo: 'PD20101003', date: '2026-06-08', output: 28, sold: 22, stock: 6, status: '正常' as const, enterpriseId: '7', enterprise: '六安农化有限责任公司' },
  { batchNo: 'PC-002*02', productName: '毒死蜱乳油', regNo: 'PD20101005', date: '2026-06-09', output: 32, sold: 28, stock: 4, status: '正常' as const, enterpriseId: '3', enterprise: '蚌埠农化股份公司' },
  { batchNo: 'PC-006*01', productName: '吡虫啉可湿性粉剂', regNo: 'PD20101002', date: '2026-06-09', output: 20, sold: 15, stock: 5, status: '正常' as const, enterpriseId: '8', enterprise: '亳州中药材农药公司' },
];

// --------------- 生产流向追踪（关联台账批次号） ---------------
export const productionFlowSales = [
  { batchNo: 'PC-001*01', buyer: '怀远县农技服务站', quantity: 15, date: '06-02', region: '蚌埠市', status: '已发货' },
  { batchNo: 'PC-001*01', buyer: '阜阳农药批发中心', quantity: 10, date: '06-03', region: '阜阳市', status: '已发货' },
  { batchNo: 'PC-001*01', buyer: '宿州农资连锁店', quantity: 12, date: '06-04', region: '宿州市', status: '已发货' },
  { batchNo: 'PC-001*01', buyer: '滁州农技服务部', quantity: 5, date: '06-05', region: '滁州市', status: '已发货' },
  { batchNo: 'PC-001*01', buyer: '合肥农资配送中心', quantity: 3, date: '06-06', region: '合肥市', status: '待发货' },
  { batchNo: 'PC-001*02', buyer: '阜阳农药批发中心', quantity: 20, date: '06-04', region: '阜阳市', status: '已发货' },
  { batchNo: 'PC-001*02', buyer: '蚌埠农药专营店', quantity: 18, date: '06-05', region: '蚌埠市', status: '已发货' },
  { batchNo: 'PC-001*02', buyer: '合肥农资配送中心', quantity: 10, date: '06-06', region: '合肥市', status: '已发货' },
  { batchNo: 'PC-002*01', buyer: '怀远县农技服务站', quantity: 20, date: '06-03', region: '蚌埠市', status: '已发货' },
  { batchNo: 'PC-002*01', buyer: '合肥农资配送中心', quantity: 15, date: '06-05', region: '合肥市', status: '已发货' },
  { batchNo: 'PC-003*01', buyer: '宿州农资连锁店', quantity: 12, date: '06-05', region: '宿州市', status: '已发货' },
  { batchNo: 'PC-003*01', buyer: '阜阳农药批发中心', quantity: 8, date: '06-06', region: '阜阳市', status: '已发货' },
  { batchNo: 'PC-004*01', buyer: '合肥农资配送中心', quantity: 18, date: '06-07', region: '合肥市', status: '已发货' },
  { batchNo: 'PC-004*01', buyer: '宿州农资连锁店', quantity: 12, date: '06-08', region: '宿州市', status: '待发货' },
];

// --------------- 经营企业 ---------------
export const businessEnterprises = [
  { id: '1', name: '怀远县农技服务站', type: '批发+零售', licenseNo: 'JY-340321001', licenseExpiry: '2027-03-15', status: '正常' as const, region: '蚌埠市怀远县', legalPerson: '刘站长', phone: '0552-801****', address: '怀远县城关镇农业路88号', creditCode: '91340321MA2N****', area: 200, restrictedPesticide: true, restrictedLicenseNo: 'XZY-340321**', licenseStart: '2022-03-15', licenseIssuer: '怀远县农业农村局', creditGrade: 'A' },
  { id: '2', name: '阜阳农药批发中心', type: '批发', licenseNo: 'JY-340821001', licenseExpiry: '2026-12-31', status: '正常' as const, region: '阜阳市颍东区', legalPerson: '陈经理', phone: '0558-232****', address: '颍东区农资大市场A-12', creditCode: '91340821MA2P****', area: 350, restrictedPesticide: false, restrictedLicenseNo: '', licenseStart: '2022-12-31', licenseIssuer: '阜阳市农业农村局', creditGrade: 'A' },
  { id: '3', name: '宿州农资连锁店', type: '零售', licenseNo: 'JY-341301001', licenseExpiry: '2027-01-20', status: '正常' as const, region: '宿州市埇桥区', legalPerson: '张店长', phone: '0557-335****', address: '埇桥区汴河路66号', creditCode: '91341301MA2Q****', area: 120, restrictedPesticide: false, restrictedLicenseNo: '', licenseStart: '2023-01-20', licenseIssuer: '宿州市农业农村局', creditGrade: 'B' },
  { id: '4', name: '蚌埠农药专营店', type: '零售', licenseNo: 'JY-340301001', licenseExpiry: '2026-07-15', status: '临期' as const, region: '蚌埠市蚌山区', legalPerson: '周老板', phone: '0552-208****', address: '蚌山区朝阳路158号', creditCode: '91340301MA2R****', area: 80, restrictedPesticide: false, restrictedLicenseNo: '', licenseStart: '2022-07-15', licenseIssuer: '蚌埠市农业农村局', creditGrade: 'B' },
  { id: '5', name: '合肥农资配送中心', type: '批发+零售', licenseNo: 'JY-340101001', licenseExpiry: '2028-06-30', status: '正常' as const, region: '合肥市肥西县', legalPerson: '林经理', phone: '0551-688****', address: '肥西县上派镇金寨南路45号', creditCode: '91340101MA2S****', area: 500, restrictedPesticide: true, restrictedLicenseNo: 'XZY-340101**', licenseStart: '2024-06-30', licenseIssuer: '合肥市农业农村局', creditGrade: 'A' },
  { id: '6', name: '滁州农技服务部', type: '零售', licenseNo: 'JY-341101001', licenseExpiry: '2026-04-01', status: '过期' as const, region: '滁州市南谯区', legalPerson: '何师傅', phone: '0550-306****', address: '南谯区乌衣镇农贸街22号', creditCode: '91341101MA2T****', area: 60, restrictedPesticide: false, restrictedLicenseNo: '', licenseStart: '2021-04-01', licenseIssuer: '滁州市农业农村局', creditGrade: 'D' },
];

// --------------- 在库库存（关联经营企业 + 登记证号 + 生产批次号） ---------------
export const inventoryData = [
  { enterpriseId: '1', enterpriseName: '怀远县农技服务站', productName: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*01', stock: 5, safeStock: 3, expiry: '2027-06-30', status: '正常' as const },
  { enterpriseId: '1', enterpriseName: '怀远县农技服务站', productName: '戊唑醇悬浮剂', regNo: 'PD20101003', batchNo: 'PC-002*01', stock: 3, safeStock: 2, expiry: '2026-08-20', status: '正常' as const },
  { enterpriseId: '1', enterpriseName: '怀远县农技服务站', productName: '百菌清可湿性粉剂', regNo: 'PD20101004', batchNo: 'PC-003*01', stock: 0.5, safeStock: 1, expiry: '2026-07-10', status: '不足' as const },
  { enterpriseId: '1', enterpriseName: '怀远县农技服务站', productName: '吡虫啉可湿性粉剂', regNo: 'PD20101002', batchNo: 'PC-001*03', stock: 3, safeStock: 2, expiry: '2026-07-15', status: '临期' as const },
  { enterpriseId: '2', enterpriseName: '阜阳农药批发中心', productName: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*02', stock: 10, safeStock: 5, expiry: '2027-06-30', status: '正常' as const },
  { enterpriseId: '2', enterpriseName: '阜阳农药批发中心', productName: '百菌清可湿性粉剂', regNo: 'PD20101004', batchNo: 'PC-003*01', stock: 4, safeStock: 3, expiry: '2026-07-10', status: '临期' as const },
  { enterpriseId: '2', enterpriseName: '阜阳农药批发中心', productName: '戊唑醇悬浮剂', regNo: 'PD20101003', batchNo: 'PC-005*01', stock: 4, safeStock: 3, expiry: '2028-03-20', status: '正常' as const },
  { enterpriseId: '3', enterpriseName: '宿州农资连锁店', productName: '百菌清可湿性粉剂', regNo: 'PD20101004', batchNo: 'PC-003*01', stock: 1.8, safeStock: 1.5, expiry: '2026-07-10', status: '临期' as const },
  { enterpriseId: '4', enterpriseName: '蚌埠农药专营店', productName: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*02', stock: 0.3, safeStock: 1, expiry: '2027-06-30', status: '不足' as const },
  { enterpriseId: '4', enterpriseName: '蚌埠农药专营店', productName: '戊唑醇悬浮剂', regNo: 'PD20101003', batchNo: 'PC-002*01', stock: 1.2, safeStock: 2, expiry: '2026-08-20', status: '不足' as const },
  { enterpriseId: '5', enterpriseName: '合肥农资配送中心', productName: '毒死蜱乳油', regNo: 'PD20101005', batchNo: 'PC-004*01', stock: 12, safeStock: 5, expiry: '2027-12-31', status: '正常' as const },
  { enterpriseId: '5', enterpriseName: '合肥农资配送中心', productName: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*02', stock: 7, safeStock: 4, expiry: '2027-06-30', status: '正常' as const },
];

// --------------- 入库记录（关联经营企业ID + 供应商（生产企业）+ 登记证号 + 批次号） ---------------
export const inboundRecords = [
  { id: '1', orderNo: 'RK-2026060201', enterpriseId: '1', enterprise: '怀远县农技服务站', supplierId: '1', supplier: '安徽农药化工集团有限公司', product: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*01', quantity: '5吨', unitPrice: '31,000元/吨', amount: '15.5万元', date: '2026-06-02', type: '采购入库' as const, warehouse: '1号仓库', position: '农药货架A区-03', status: '已入库' as const },
  { id: '2', orderNo: 'RK-2026060301', enterpriseId: '2', enterprise: '阜阳农药批发中心', supplierId: '1', supplier: '安徽农药化工集团有限公司', product: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*02', quantity: '10吨', unitPrice: '31,000元/吨', amount: '31.0万元', date: '2026-06-03', type: '采购入库' as const, warehouse: '2号仓库', position: '农药货架B区-01', status: '已入库' as const },
  { id: '3', orderNo: 'RK-2026060401', enterpriseId: '1', enterprise: '怀远县农技服务站', supplierId: '3', supplier: '蚌埠农化股份公司', product: '戊唑醇悬浮剂', regNo: 'PD20101003', batchNo: 'PC-002*01', quantity: '3吨', unitPrice: '52,000元/吨', amount: '15.6万元', date: '2026-06-04', type: '采购入库' as const, warehouse: '1号仓库', position: '农药货架A区-05', status: '已入库' as const },
  { id: '4', orderNo: 'RK-2026060501', enterpriseId: '3', enterprise: '宿州农资连锁店', supplierId: '4', supplier: '阜阳农药厂', product: '百菌清可湿性粉剂', regNo: 'PD20101004', batchNo: 'PC-003*01', quantity: '2吨', unitPrice: '28,000元/吨', amount: '5.6万元', date: '2026-06-05', type: '采购入库' as const, warehouse: '3号仓库', position: '农药货架C区-02', status: '已入库' as const },
  { id: '5', orderNo: 'RK-2026060502', enterpriseId: '5', enterprise: '合肥农资配送中心', supplierId: '5', supplier: '宿州农化科技有限公司', product: '毒死蜱乳油', regNo: 'PD20101005', batchNo: 'PC-004*01', quantity: '8吨', unitPrice: '35,000元/吨', amount: '28.0万元', date: '2026-06-05', type: '采购入库' as const, warehouse: '1号仓库', position: '农药货架A区-08', status: '已入库' as const },
  { id: '6', orderNo: 'RK-2026060601', enterpriseId: '4', enterprise: '蚌埠农药专营店', supplierId: '1', supplier: '安徽农药化工集团有限公司', product: '吡虫啉可湿性粉剂', regNo: 'PD20101002', batchNo: 'PC-001*03', quantity: '1吨', unitPrice: '45,000元/吨', amount: '4.5万元', date: '2026-06-06', type: '采购入库' as const, warehouse: '2号仓库', position: '农药货架B区-03', status: '待验收' as const },
  { id: '7', orderNo: 'RK-2026060602', enterpriseId: '1', enterprise: '怀远县农技服务站', supplierId: '1', supplier: '安徽农药化工集团有限公司', product: '草甘膦水剂', regNo: 'PD20101001', batchNo: 'PC-001*01', quantity: '2吨', unitPrice: '31,000元/吨', amount: '6.2万元', date: '2026-06-06', type: '退货入库' as const, warehouse: '1号仓库', position: '退货区-01', status: '已入库' as const },
  { id: '8', orderNo: 'RK-2026060701', enterpriseId: '2', enterprise: '阜阳农药批发中心', supplierId: '7', supplier: '六安农化有限责任公司', product: '戊唑醇悬浮剂', regNo: 'PD20101003', batchNo: 'PC-005*01', quantity: '4吨', unitPrice: '52,000元/吨', amount: '20.8万元', date: '2026-06-07', type: '采购入库' as const, warehouse: '2号仓库', position: '农药货架B区-06', status: '已入库' as const },
];

// --------------- 出库记录（关联经营企业ID + 登记证号） ---------------
export const outboundRecords = [
  { id: '1', orderNo: 'CK-2026060301', enterpriseId: '1', enterprise: '怀远县农技服务站', buyer: '张三种粮大户', buyerType: '农户', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '8吨', quantity: '200L', unitPrice: '62元/L', amount: '12,400元', date: '2026-06-03', type: '销售出库' as const, purpose: '农业生产', region: '蚌埠怀远县', status: '已出库' as const },
  { id: '2', orderNo: 'CK-2026060401', enterpriseId: '1', enterprise: '怀远县农技服务站', buyer: '李四家庭农场', buyerType: '农业企业', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '7.8吨', quantity: '150L', unitPrice: '62元/L', amount: '9,300元', date: '2026-06-04', type: '销售出库' as const, purpose: '农业生产', region: '蚌埠怀远县', status: '已出库' as const },
  { id: '3', orderNo: 'CK-2026060501', enterpriseId: '1', enterprise: '怀远县农技服务站', buyer: '王五种养殖场', buyerType: '合作社', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '7.6吨', quantity: '100L', unitPrice: '62元/L', amount: '6,200元', date: '2026-06-05', type: '销售出库' as const, purpose: '农业生产', region: '蚌埠怀远县', status: '已出库' as const },
  { id: '4', orderNo: 'CK-2026060502', enterpriseId: '2', enterprise: '阜阳农药批发中心', buyer: '阜南农技站', buyerType: '农业企业', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '9.5吨', quantity: '500L', unitPrice: '60元/L', amount: '30,000元', date: '2026-06-05', type: '销售出库' as const, purpose: '农业生产', region: '阜阳阜南县', status: '已出库' as const },
  { id: '5', orderNo: 'CK-2026060601', enterpriseId: '1', enterprise: '怀远县农技服务站', buyer: '赵六合作社', buyerType: '合作社', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '7.5吨', quantity: '80L', unitPrice: '62元/L', amount: '4,960元', date: '2026-06-06', type: '销售出库' as const, purpose: '农业生产', region: '蚌埠怀远县', status: '已出库' as const },
  { id: '6', orderNo: 'CK-2026060602', enterpriseId: '3', enterprise: '宿州农资连锁店', buyer: '刘七农户', buyerType: '农户', product: '百菌清可湿性粉剂', regNo: 'PD20101004', currentStock: '1.8吨', quantity: '50kg', unitPrice: '85元/kg', amount: '4,250元', date: '2026-06-06', type: '销售出库' as const, purpose: '农业生产', region: '宿州埇桥区', status: '已出库' as const },
  { id: '7', orderNo: 'CK-2026060701', enterpriseId: '1', enterprise: '怀远县农技服务站', buyer: '安徽农药化工集团有限公司', buyerType: '农业企业', product: '草甘膦水剂', regNo: 'PD20101001', currentStock: '7.3吨', quantity: '2吨', unitPrice: '31,000元/吨', amount: '62,000元', date: '2026-06-07', type: '退货出库' as const, purpose: '退货', region: '蚌埠怀远县', status: '已出库' as const },
  { id: '8', orderNo: 'CK-2026060702', enterpriseId: '5', enterprise: '合肥农资配送中心', buyer: '肥西植保站', buyerType: '农业企业', product: '毒死蜱乳油', regNo: 'PD20101005', currentStock: '7.5吨', quantity: '300L', unitPrice: '48元/L', amount: '14,400元', date: '2026-06-07', type: '销售出库' as const, purpose: '农业生产', region: '合肥肥西县', status: '待出库' as const },
];

// --------------- 异常预警（关联经营企业 + 登记证号） ---------------
export const alertRecords = [
  { id: '1', type: '库存不足' as const, level: '严重' as const, product: '百菌清可湿性粉剂', regNo: 'PD20101004', detail: '当前库存0.5吨，安全库存1吨，低于安全库存50%', enterprise: '怀远县农技服务站', enterpriseId: '1', date: '2026-06-06', handled: false },
  { id: '2', type: '库存不足' as const, level: '严重' as const, product: '草甘膦水剂', regNo: 'PD20101001', detail: '蚌埠农药专营店当前库存0.3吨，安全库存1吨，低于安全库存70%', enterprise: '蚌埠农药专营店', enterpriseId: '4', date: '2026-06-06', handled: false },
  { id: '3', type: '临近过期' as const, level: '警告' as const, product: '百菌清可湿性粉剂', regNo: 'PD20101004', detail: '有效期至2026-07-10，剩余34天', enterprise: '怀远县农技服务站', enterpriseId: '1', date: '2026-06-06', handled: false },
  { id: '4', type: '临近过期' as const, level: '警告' as const, product: '吡虫啉可湿性粉剂', regNo: 'PD20101002', detail: '有效期至2026-07-15，剩余39天', enterprise: '怀远县农技服务站', enterpriseId: '1', date: '2026-06-06', handled: false },
  { id: '5', type: '临近过期' as const, level: '警告' as const, product: '百菌清可湿性粉剂', regNo: 'PD20101004', detail: '有效期至2026-07-10，剩余34天', enterprise: '宿州农资连锁店', enterpriseId: '3', date: '2026-06-06', handled: true },
  { id: '6', type: '过期农药' as const, level: '严重' as const, product: '草铵膦水剂', regNo: 'PD20101006', detail: '已于2025-12-01过期，需立即下架处理', enterprise: '阜阳农药批发中心', enterpriseId: '2', date: '2026-06-05', handled: false },
  { id: '7', type: '过期农药' as const, level: '严重' as const, product: '草铵膦水剂', regNo: 'PD20101006', detail: '已于2025-12-01过期，需立即下架处理', enterprise: '合肥农资配送中心', enterpriseId: '5', date: '2026-06-05', handled: false },
  { id: '8', type: '库存不足' as const, level: '警告' as const, product: '戊唑醇悬浮剂', regNo: 'PD20101003', detail: '当前库存1.2吨，安全库存2吨，低于安全库存40%', enterprise: '蚌埠农药专营店', enterpriseId: '4', date: '2026-06-06', handled: false },
  { id: '9', type: '临近过期' as const, level: '警告' as const, product: '百菌清可湿性粉剂', regNo: 'PD20101004', detail: '有效期至2026-07-10，剩余34天', enterprise: '阜阳农药批发中心', enterpriseId: '2', date: '2026-06-06', handled: false },
  { id: '10', type: '台账异常' as const, level: '警告' as const, product: '草甘膦水剂', regNo: 'PD20101001', detail: '入库数量与实际库存不符，差异200L', enterprise: '怀远县农技服务站', enterpriseId: '1', date: '2026-06-05', handled: false },
  { id: '11', type: '台账异常' as const, level: '警告' as const, product: '吡虫啉可湿性粉剂', regNo: 'PD20101002', detail: '出库记录缺少购买方身份信息', enterprise: '阜阳农药批发中心', enterpriseId: '2', date: '2026-06-04', handled: true },
  { id: '12', type: '许可证临期' as const, level: '警告' as const, product: '-', regNo: '-', detail: '经营许可证JY-340301001将于2026-07-15到期，剩余39天', enterprise: '蚌埠农药专营店', enterpriseId: '4', date: '2026-06-06', handled: false },
];

// --------------- 经营流向追踪（关联出库记录数据） ---------------
export const businessFlowSales = [
  { buyer: '张三种粮大户', quantity: '200L', date: '06-03', region: '蚌埠怀远县', purpose: '农业生产' },
  { buyer: '李四家庭农场', quantity: '150L', date: '06-04', region: '蚌埠怀远县', purpose: '农业生产' },
  { buyer: '王五种养殖场', quantity: '100L', date: '06-05', region: '蚌埠怀远县', purpose: '农业生产' },
  { buyer: '赵六合作社', quantity: '80L', date: '06-06', region: '蚌埠怀远县', purpose: '农业生产' },
];

// --------------- 接口管理 ---------------
export const interfaceList = [
  { id: '1', name: '生产台账同步', type: '推送', system: '省农药监管平台', status: '正常' as const, lastSync: '10:30', address: 'https://api.ahpesticide.gov.cn/produce/sync', frequency: '每小时', syncFields: ['批次编号', '产品名称', '数量', '生产日期', '销售去向'] },
  { id: '2', name: '经营台账同步', type: '推送', system: '省农药监管平台', status: '正常' as const, lastSync: '10:25', address: 'https://api.ahpesticide.gov.cn/business/sync', frequency: '每小时', syncFields: ['入库单号', '出库单号', '产品名称', '数量', '购买方'] },
  { id: '3', name: '企业信息查询', type: '查询', system: '省农药监管平台', status: '正常' as const, lastSync: '10:20', address: 'https://api.ahpesticide.gov.cn/enterprise/query', frequency: '实时', syncFields: ['企业名称', '许可证号', '状态'] },
  { id: '4', name: '登记证信息同步', type: '接收', system: '农业农村部', status: '正常' as const, lastSync: '昨日', address: 'https://api.moa.gov.cn/pesticide/reg', frequency: '每日', syncFields: ['登记证号', '农药名称', '有效期'] },
  { id: '5', name: '经营许可查询', type: '查询', system: '市场监管局', status: '降级' as const, lastSync: '10:15', address: 'https://api.amr.gov.cn/license/query', frequency: '实时', syncFields: ['许可证号', '企业名称', '有效期'] },
];

// --------------- 图表数据（与生产企业/经营企业地区分布一致） ---------------
export const monthlyProductionTrend = [
  { month: '1月', value: 0.38 },
  { month: '2月', value: 0.42 },
  { month: '3月', value: 0.55 },
  { month: '4月', value: 0.48 },
  { month: '5月', value: 0.58 },
  { month: '6月', value: 0.52 },
];

export const monthlyBusinessTrend = [
  { month: '1月', value: 1.8 },
  { month: '2月', value: 2.1 },
  { month: '3月', value: 2.8 },
  { month: '4月', value: 2.5 },
  { month: '5月', value: 2.9 },
  { month: '6月', value: 2.6 },
];

export const cityProductionData = [
  { city: '蚌埠', production: 8000, business: 32000 },
  { city: '阜阳', production: 6500, business: 28000 },
  { city: '宿州', production: 5200, business: 21000 },
  { city: '滁州', production: 4800, business: 19000 },
  { city: '合肥', production: 4200, business: 35000 },
  { city: '六安', production: 3600, business: 15000 },
  { city: '亳州', production: 2800, business: 12000 },
  { city: '其他', production: 12800, business: 24000 },
];

export const productTypeAnalysis = [
  { type: '除草剂', count: 156, productionShare: 35, businessShare: 32, trend: '+8%' },
  { type: '杀虫剂', count: 234, productionShare: 28, businessShare: 30, trend: '+5%' },
  { type: '杀菌剂', count: 189, productionShare: 22, businessShare: 25, trend: '+12%' },
  { type: '植物生长调节剂', count: 45, productionShare: 8, businessShare: 7, trend: '-2%' },
  { type: '其他', count: 67, productionShare: 7, businessShare: 6, trend: '持平' },
];

export const regionStatsData = [
  { region: '蚌埠市', productionEnterprises: 2, businessEnterprises: 35, production: '8,000吨', business: '3.2亿元', reportRate: '98.5%' },
  { region: '阜阳市', productionEnterprises: 3, businessEnterprises: 42, production: '6,500吨', business: '2.8亿元', reportRate: '97.8%' },
  { region: '宿州市', productionEnterprises: 2, businessEnterprises: 38, production: '5,200吨', business: '2.1亿元', reportRate: '98.2%' },
  { region: '滁州市', productionEnterprises: 2, businessEnterprises: 28, production: '4,800吨', business: '1.9亿元', reportRate: '97.5%' },
  { region: '合肥市', productionEnterprises: 1, businessEnterprises: 25, production: '4,200吨', business: '3.5亿元', reportRate: '99.1%' },
  { region: '六安市', productionEnterprises: 1, businessEnterprises: 18, production: '3,600吨', business: '1.5亿元', reportRate: '96.8%' },
  { region: '亳州市', productionEnterprises: 1, businessEnterprises: 15, production: '2,800吨', business: '1.2亿元', reportRate: '95.5%' },
];

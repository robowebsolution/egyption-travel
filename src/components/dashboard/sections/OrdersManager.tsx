import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Check, 
  X, 
  Eye, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  DollarSign,
  Package
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';

// نموذج بيانات الطلب
interface Order {
  id: string;
  name: string; // اسم العميل
  email: string;
  phone: string;
  date: string;
  people: number;
  source_page: string; // 'package' أو 'experience'
  source_id: string;
  source_name: string; // اسم الباقة أو التجربة
  price: number; // سعر الطلب
  status: string; // 'pending' أو 'confirmed' أو 'cancelled'
  created_at: string;
  address?: string;
  notes?: string;
}

// وظيفة لجلب الطلبات من Supabase
const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // جلب البيانات من Supabase عند تحميل المكون
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);

  // تصفية الطلبات حسب البحث والفلاتر
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.price && searchTerm && order.price.toString().includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.source_page === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // تحديث حالة الطلب
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // تحديث الحالة في Supabase
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // تحديث الحالة محلياً
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      const statusMessages = {
        pending: 'تم تعليق الطلب',
        confirmed: 'تم تأكيد الطلب',
        cancelled: 'تم إلغاء الطلب'
      };
      
      toast.success(statusMessages[newStatus]);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  // عرض تفاصيل الطلب
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h2>
          <p className="text-gray-500 mt-1">إدارة وتتبع طلبات العملاء</p>
        </div>
        <Badge className="bg-pharaoh-600 hover:bg-pharaoh-700 text-white text-base py-1.5">
          {filteredOrders.length} طلب
        </Badge>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          {error}
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => {
              setLoading(true);
              fetchOrders().then(data => {
                setOrders(data);
                setError(null);
                setLoading(false);
              }).catch(err => {
                console.error('Error reloading orders:', err);
                setError('فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى.');
                setLoading(false);
              });
            }}
          >
            إعادة المحاولة
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          لا توجد طلبات حالياً
        </div>
      ) : (
      <>
      {/* أدوات البحث والتصفية */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="البحث عن طلب بالاسم أو البريد الإلكتروني أو رقم الطلب"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="confirmed">مؤكد</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="package">باقات سياحية</SelectItem>
              <SelectItem value="experience">تجارب سياحية</SelectItem>
              <SelectItem value="custom">رحلات مخصصة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* تبويبات الطلبات */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">جميع الطلبات ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            قيد الانتظار ({orders.filter(o => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            مؤكدة ({orders.filter(o => o.status === 'confirmed').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            ملغية ({orders.filter(o => o.status === 'cancelled').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>اسم الباقة/التجربة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{order.name}</span>
                            <span className="text-xs text-gray-500">{order.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.source_page === 'package' && 'باقة سياحية'}
                          {order.source_page === 'experience' && 'تجربة سياحية'}
                          {order.source_page !== 'package' && order.source_page !== 'experience' && order.source_page}
                        </TableCell>
                        <TableCell>{order.source_name || '-'}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{order.price ? `${order.price} $` : '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                              ${order.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                              ${order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                            `}
                          >
                            {order.status === 'pending' && 'قيد الانتظار'}
                            {order.status === 'confirmed' && 'مؤكد'}
                            {order.status === 'cancelled' && 'ملغي'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                              <Eye size={16} className="mr-1" /> عرض
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                <CheckCircle size={16} className="mr-1" /> تأكيد
                              </Button>
                            )}
                            {order.status !== 'cancelled' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                <XCircle size={16} className="mr-1" /> إلغاء
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        لا توجد طلبات تطابق معايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-gray-500">
                إجمالي الطلبات: {filteredOrders.length}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* محتوى تبويب الطلبات قيد الانتظار */}
        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(o => o.status === 'pending').length > 0 ? (
                    filteredOrders
                      .filter(o => o.status === 'pending')
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{order.name}</span>
                              <span className="text-xs text-gray-500">{order.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.source_page === 'package' && 'باقة سياحية'}
                            {order.source_page === 'experience' && 'تجربة سياحية'}
                            {order.source_page !== 'package' && order.source_page !== 'experience' && order.source_page}
                          </TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>{order.price ? `${order.price} ج.م` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              قيد الانتظار
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                                <Eye size={16} className="mr-1" /> عرض
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                <CheckCircle size={16} className="mr-1" /> تأكيد
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                <XCircle size={16} className="mr-1" /> إلغاء
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        لا توجد طلبات قيد الانتظار
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* محتوى تبويب الطلبات المؤكدة */}
        <TabsContent value="confirmed" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(o => o.status === 'confirmed').length > 0 ? (
                    filteredOrders
                      .filter(o => o.status === 'confirmed')
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{order.name}</span>
                              <span className="text-xs text-gray-500">{order.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.source_page === 'package' && 'باقة سياحية'}
                            {order.source_page === 'experience' && 'تجربة سياحية'}
                            {order.source_page !== 'package' && order.source_page !== 'experience' && order.source_page}
                          </TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>{order.price ? `${order.price} ج.م` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              مؤكد
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                                <Eye size={16} className="mr-1" /> عرض
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                <XCircle size={16} className="mr-1" /> إلغاء
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        لا توجد طلبات مؤكدة
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* محتوى تبويب الطلبات الملغية */}
        <TabsContent value="cancelled" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(o => o.status === 'cancelled').length > 0 ? (
                    filteredOrders
                      .filter(o => o.status === 'cancelled')
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{order.name}</span>
                              <span className="text-xs text-gray-500">{order.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.source_page === 'package' && 'باقة سياحية'}
                            {order.source_page === 'experience' && 'تجربة سياحية'}
                            {order.source_page !== 'package' && order.source_page !== 'experience' && order.source_page}
                          </TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>{order.price ? `${order.price} ج.م` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              ملغي
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                                <Eye size={16} className="mr-1" /> عرض
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => updateOrderStatus(order.id, 'pending')}
                              >
                                <Clock size={16} className="mr-1" /> استعادة
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        لا توجد طلبات ملغية
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* حوار عرض تفاصيل الطلب */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <DialogDescription>
              معلومات كاملة عن الطلب والعميل
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">معلومات العميل</h3>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>{selectedOrder.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                  {selectedOrder.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{selectedOrder.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">معلومات الطلب</h3>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-gray-400" />
                    <span>
                      {selectedOrder.source_page === 'package' ? 'باقة سياحية' : 
                       selectedOrder.source_page === 'experience' ? 'تجربة سياحية' : 
                       selectedOrder.source_page}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-gray-400" />
                    <span>{selectedOrder.source_name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span>{selectedOrder.price ? `${selectedOrder.price} ج.م` : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(selectedOrder.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>{selectedOrder.people} أشخاص</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">حالة الطلب</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${selectedOrder.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${selectedOrder.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${selectedOrder.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}
                  >
                    {selectedOrder.status === 'pending' && 'قيد الانتظار'}
                    {selectedOrder.status === 'confirmed' && 'مؤكد'}
                    {selectedOrder.status === 'cancelled' && 'ملغي'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>تاريخ الإنشاء: {new Date(selectedOrder.created_at).toLocaleString('ar-EG')}</span>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">ملاحظات</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>إغلاق</Button>
            {selectedOrder && selectedOrder.status === 'pending' && (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'confirmed');
                  setIsViewDialogOpen(false);
                }}
              >
                <Check size={16} className="mr-1" /> تأكيد الطلب
              </Button>
            )}
            {selectedOrder && selectedOrder.status !== 'cancelled' && (
              <Button 
                variant="destructive"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'cancelled');
                  setIsViewDialogOpen(false);
                }}
              >
                <X size={16} className="mr-1" /> إلغاء الطلب
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}
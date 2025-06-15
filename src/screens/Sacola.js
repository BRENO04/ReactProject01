import React, { useMemo } from 'react'; 
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native'; 
import { ArrowLeft, Trash } from 'phosphor-react-native';
import { useCart } from '../../context/CartContext'; 

export default function Sacola({ navigation }) {
  const { itensSacola, removeFromCart, calcularTotal, clearCart } = useCart(); 

  const totalCalculado = useMemo(() => calcularTotal(), [itensSacola, calcularTotal]);

  const handleFinalizarPedido = () => {
    navigation.navigate('FinalizacaoPedido'); 
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={30} color="#000000" weight="bold" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Sacola</Text>
      <View style={{ width: 30 }} />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.totalContainer}>
      <Text style={styles.totalText}>Total: R$ {totalCalculado}</Text>
      <TouchableOpacity
        style={[styles.finalizarButton, { opacity: itensSacola.length === 0 ? 0.5 : 1 }]}
        onPress={handleFinalizarPedido}
        disabled={itensSacola.length === 0}
      >
        <Text style={styles.finalizarText}>Finalizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={item.imagem || require('../../assets/cocalata2.jpg')} 
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemPrice}>R$ {(Number(item.preco || 0) * Number(item.quantidade || 0)).toFixed(2)}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert('Confirmação', `Remover ${item.nome} da sacola?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removeFromCart(item.id), style: 'destructive' },
      ])} style={styles.removeButton}>
        <Trash size={20} color="#D32F2F" weight="fill" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={itensSacola}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text style={styles.emptyText}>A sacola está vazia!</Text>}
        style={styles.listStyle}
        contentContainerStyle={styles.listContentContainer} 
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listStyle: {
    flex: 1, 
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20, 
    flexGrow: 1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#757575',
  },
  removeButton: {
    padding: 8,
  },
  emptyText: {
    flex: 1,
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  totalContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalizarButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  finalizarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
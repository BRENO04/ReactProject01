import React, { useMemo } from 'react'; 
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'; 
import { ArrowLeft } from 'phosphor-react-native';
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
        <ArrowLeft size={30} color="white" weight="bold" />
      </TouchableOpacity>
   
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
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <Text style={styles.removeText}>X</Text>
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
    backgroundColor: 'black',
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
    paddingVertical: 10,
    
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemImage: {
    width: 60, 
    height: 60,
    borderRadius: 10,
    marginRight: 15, 
  },
  itemDetails: {
    flex: 1,
    
  },
  itemName: {
    fontSize: 16,
    color: 'white',
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
    color: '#CCC',
  },
  removeButton: {
    padding: 10, 
    marginLeft: 10, 
  },
  removeText: {
    fontSize: 20, 
    color: 'red',
    fontWeight: 'bold',
  },
  emptyText: {
    flex: 1, 
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 50, 
    paddingHorizontal: 20,
  },
  totalContainer: {
    paddingTop: 30, 
    paddingBottom: 20, 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderTopColor: '#333',
    marginTop: 10, 
  },
  totalText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalizarButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 50, 
    borderRadius: 10,
  },
  finalizarText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


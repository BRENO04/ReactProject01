import React, { useState, useMemo } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Alert, ActivityIndicator, SafeAreaView
} from 'react-native'; 
import { ArrowLeft } from 'phosphor-react-native';
import { useCart } from '../../context/CartContext'; 

export default function FinalizacaoPedido({ navigation }) {
  const { itensSacola, calcularTotal, clearCart } = useCart(); 
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isConfirming, setIsConfirming] = useState(false); 
  const [errors, setErrors] = useState({}); 

  const totalCalculado = useMemo(() => calcularTotal(), [itensSacola, calcularTotal]);

  const validateForm = () => {
      const newErrors = {};
      if (!nomeCliente.trim()) {
          newErrors.nome = 'Nome é obrigatório.';
      }
    
      if (!telefone.trim()) {
          newErrors.telefone = 'Telefone é obrigatório.';
      } else if (!/^[0-9\-\s\(\)]+$/.test(telefone)) { 
           newErrors.telefone = 'Telefone inválido.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; 
  };

  const handleConfirmarPedido = async () => {
    if (!validateForm()) {
      return;
    }

    setIsConfirming(true); 

    console.log('Enviando pedido para API:', {
        nome: nomeCliente,
        telefone: telefone,
        itens: itensSacola,
        total: totalCalculado,
    });
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const sucessoApi = true; 

    setIsConfirming(false); 

    if (sucessoApi) {
        Alert.alert(
            'Pedido Confirmado!',
            `Obrigado, ${nomeCliente}! Seu pedido de R$ ${totalCalculado} foi recebido.`,
            [
                { text: 'OK', onPress: () => {
                    clearCart(); 
                    navigation.navigate('Home'); 
                }}
            ]
        );
    } else {
        Alert.alert('Erro', 'Houve um problema ao confirmar seu pedido. Tente novamente.');
    }
  };

  const renderItem = ({ item, index }) => {

    const isLastItem = index === itensSacola.length - 1;

    return (
        <View 
            style={[
                styles.itemContainer, 
                isLastItem ? styles.lastItemContainer : null 
            ]}
        >
            <Image
                source={item.imagem || require('../../assets/placeHolder001.png')} 
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemPrice}>R$ {(Number(item.preco || 0) * Number(item.quantidade || 0)).toFixed(2)}</Text>
                <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
            </View>
        </View>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isConfirming}>
                <ArrowLeft size={30} color="white" weight="bold" />
                </TouchableOpacity>
                <Text style={styles.title}>Finalizar Pedido</Text>
                <View style={{ width: 30 }} />
            </View>

            <Text style={styles.sectionTitle}>Resumo da Sacola</Text>
            <FlatList
                data={itensSacola}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem} 
                style={styles.listContainer}
                scrollEnabled={false} 
            />

            <Text style={styles.sectionTitle}>Seus Dados</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={[styles.input, errors.nome ? styles.inputError : null]}
                    value={nomeCliente}
                    onChangeText={setNomeCliente}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#888"
                    autoCapitalize="words"
                    editable={!isConfirming}
                />
                {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
                
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={[styles.input, errors.telefone ? styles.inputError : null]}
                    value={telefone}
                    onChangeText={setTelefone}
                    placeholder="(XX) XXXXX-XXXX"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    editable={!isConfirming}
                />
                 {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
            </View>

            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: R$ {totalCalculado}</Text>
                <TouchableOpacity 
                    style={[styles.confirmarButton, isConfirming ? styles.confirmarButtonDisabled : null]}
                    onPress={handleConfirmarPedido}
                    disabled={isConfirming}
                >
                    {isConfirming ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <Text style={styles.confirmarText}>Confirmar Pedido</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },

  scrollView: {
      flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  title: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },

  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 25,
      marginBottom: 15,
      marginLeft: 20,
  },

  listContainer: {
      marginHorizontal: 20,
      backgroundColor: '#1C1C1C',
      borderRadius: 10,
      padding: 10,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444', 
  },

  lastItemContainer: {
      borderBottomWidth: 0, 
  },

  itemImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: 'white',
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#BBB',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#CCC',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 5, 
  },
  inputError: {
      borderColor: 'red',
      borderWidth: 1,
  },
  errorText: {
      color: 'red',
      fontSize: 13,
      marginBottom: 10, 
  },
  totalContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 30, 
  },
  totalText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmarButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  confirmarButtonDisabled: {
      backgroundColor: '#888',
  },
  confirmarText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


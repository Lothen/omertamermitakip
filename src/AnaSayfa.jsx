import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Home() {
  const [isim, setIsim] = useState('')
  const [mermi, setMermi] = useState('')
  const [koruma, setKoruma] = useState('')
  const [kayitliIsimler, setKayitliIsimler] = useState([]) // Veritabanındaki isimler

  // Sayfa açılınca mevcut isimleri getir
  useEffect(() => {
    mevcutIsimleriGetir()
  }, [])

  async function mevcutIsimleriGetir() {
    const { data, error } = await supabase
      .from('oyuncular')
      .select('kullanici_adi')
    
    if (!error && data) {
      // Aynı isimden defalarca gelmesin diye benzersiz yapıyoruz
      const benzersizIsimler = [...new Set(data.map(item => item.kullanici_adi))]
      setKayitliIsimler(benzersizIsimler)
    }
  }

  async function veriGonder(e) {
    e.preventDefault()
    
    if (!isim || !mermi || !koruma) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }

    const { error } = await supabase
      .from('oyuncular')
      .insert([{ 
          kullanici_adi: isim, 
          mermi_sayisi: Number(mermi), 
          koruma_sayisi: Number(koruma) 
      }])

    if (error) {
      alert('Hata: ' + error.message)
    } else {
      alert('Kayıt Başarıyla Gönderildi! ✅')
      // Formu temizle ama isim listesini tekrar güncelle (yeni isim eklenmiş olabilir)
      setIsim('')
      setMermi('')
      setKoruma('')
      mevcutIsimleriGetir() 
    }
  }

  // --- STİLLER ---
  const containerStyle = { maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }
  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '18px', fontWeight: 'bold', color: '#333' }
  const inputStyle = { width: '100%', padding: '15px', fontSize: '18px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #ccc' }
  const buttonStyle = { width: '100%', padding: '20px', fontSize: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🔫 Mermi Giriş Paneli</h1>
      
      <form onSubmit={veriGonder}>
        <div>
          <label style={labelStyle}>Oyuncu Adı</label>
          {/* HEM YAZILABİLİR HEM SEÇİLEBİLİR ALAN */}
          <input 
            type="text" 
            list="oyuncu-listesi"  // Bu ID aşağıdaki datalist ID'si ile aynı olmalı
            placeholder="İsim yazın veya listeden seçin..." 
            value={isim}
            onChange={(e) => setIsim(e.target.value)}
            style={inputStyle}
            autoComplete="off"
          />
          {/* ÖNERİ LİSTESİ */}
          <datalist id="oyuncu-listesi">
            {kayitliIsimler.map((kayitliIsim, index) => (
              <option key={index} value={kayitliIsim} />
            ))}
          </datalist>
        </div>

        <div>
          <label style={labelStyle}>Mermi Sayısı</label>
          <input 
            type="number" 
            placeholder="0" 
            value={mermi}
            onChange={(e) => setMermi(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Koruma Sayısı</label>
          <input 
            type="number" 
            placeholder="0" 
            value={koruma}
            onChange={(e) => setKoruma(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>KAYDET</button>
      </form>
      
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <a href="/admin" style={{color: '#999', textDecoration: 'none', fontSize: '12px'}}>Yönetici Girişi</a>
      </div>
    </div>
  )
}
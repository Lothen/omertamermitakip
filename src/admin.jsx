import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Admin() {
  const [sifre, setSifre] = useState('')
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [tumVeriler, setTumVeriler] = useState([]) 
  const [secilenKullanici, setSecilenKullanici] = useState('') 

  const DOGRU_SIFRE = "qwex123^Q31d"

  function sifreKontrol() {
    if (sifre === DOGRU_SIFRE) {
      setGirisYapildi(true)
      verileriGetir()
    } else {
      alert("Hatalı Şifre!")
    }
  }

  async function verileriGetir() {
    const { data, error } = await supabase
      .from('oyuncular')
      .select('*')
      .order('kayit_tarihi', { ascending: true }) 
    
    if (!error) setTumVeriler(data)
  }

  const kullaniciListesi = [...new Set(tumVeriler.map(item => item.kullanici_adi))]
  const secilenKullaniciVerileri = tumVeriler.filter(item => item.kullanici_adi === secilenKullanici)
  const tabloVerisi = [...secilenKullaniciVerileri].reverse()

  // Herkesin son durumu
  const sonDurumlar = kullaniciListesi.map(kullanici => {
    const kullaniciKayitlari = tumVeriler.filter(item => item.kullanici_adi === kullanici)
    return kullaniciKayitlari[kullaniciKayitlari.length - 1]
  })

  // --- YENİ EKLENEN HESAPLAMA: AİLEDEKİ TOPLAM MERMİ ---
  // sonDurumlar dizisindeki herkesin mermi sayısını topluyoruz
  const toplamMermi = sonDurumlar.reduce((toplam, veri) => toplam + (veri?.mermi_sayisi || 0), 0)

  const grafikVerisi = secilenKullaniciVerileri.map(item => ({
    ...item,
    saat: new Date(item.kayit_tarihi).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }))

  const containerStyle = { width: '95%', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '20px' }
  const tableHeaderStyle = { backgroundColor: '#007bff', color: 'white', fontSize: '20px', padding: '15px' }
  const tableCellStyle = { padding: '15px', fontSize: '18px', borderBottom: '1px solid #ddd' }
  const searchInputStyle = { padding: '15px', fontSize: '18px', borderRadius: '5px', border: '2px solid #007bff', width: '300px' }

  if (!girisYapildi) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <h2>🔒 Yönetici Girişi</h2>
        <input type="password" placeholder="Şifre" value={sifre} onChange={(e) => setSifre(e.target.value)} style={{ padding: '15px', fontSize: '20px' }} />
        <button onClick={sifreKontrol} style={{ marginTop: '15px', padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}>Giriş Yap</button>
        <a href="/" style={{ marginTop: '20px', fontSize: '18px' }}>Ana Sayfaya Dön</a>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ddd', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>📊 Analiz Paneli</h1>
        
        {/* KULLANICI SEÇİMİ */}
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <label style={{fontSize: '20px', fontWeight: 'bold'}}>Oyuncu Seç:</label>
            <input 
                list="admin-oyuncu-listesi" 
                placeholder="İsim ara veya seç..." 
                value={secilenKullanici}
                onChange={(e) => setSecilenKullanici(e.target.value)}
                style={searchInputStyle}
            />
            <datalist id="admin-oyuncu-listesi">
                {kullaniciListesi.map((isim, index) => (
                    <option key={index} value={isim} />
                ))}
            </datalist>
            {secilenKullanici && (
                <button onClick={() => setSecilenKullanici('')} style={{padding: '15px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px'}}>
                  Tümünü Gör
                </button>
            )}
        </div>

        <button onClick={() => window.location.href='/'} style={{ padding: '15px 30px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>Çıkış</button>
      </div>

      {/* --- YENİ EKLENEN: TOPLAM MERMİ KARTI --- */}
      {/* Sadece kimse seçili değilken (Genel Bakışta) görünsün */}
      {secilenKullanici === "" && (
        <div style={{
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            textAlign: 'center', 
            marginBottom: '30px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
            <h2 style={{ margin: 0, fontSize: '36px' }}>🏆 AİLEDEKİ TOPLAM MERMİ: {toplamMermi.toLocaleString()}</h2>
        </div>
      )}
      
      {/* İÇERİK */}
      {secilenKullanici === "" || !kullaniciListesi.includes(secilenKullanici) ? (
        
        // --- GENEL BAKIŞ MODU ---
        <div>
          <h2 style={{fontSize: '28px', marginBottom: '20px', borderLeft: '5px solid #007bff', paddingLeft: '10px'}}>📌 Genel Durum</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Oyuncu</th>
                <th style={tableHeaderStyle}>Son Mermi</th>
                <th style={tableHeaderStyle}>Son Koruma</th>
                <th style={tableHeaderStyle}>Son Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              {sonDurumlar.map((veri) => (
                <tr key={veri?.id || Math.random()} style={{ textAlign: 'center', backgroundColor: '#fff', cursor: 'pointer' }} onClick={() => setSecilenKullanici(veri?.kullanici_adi)}>
                  <td style={{...tableCellStyle, fontWeight: 'bold'}}>{veri?.kullanici_adi}</td>
                  <td style={{...tableCellStyle, color: '#28a745', fontWeight: 'bold'}}>{veri?.mermi_sayisi}</td>
                  <td style={{...tableCellStyle, color: '#17a2b8'}}>{veri?.koruma_sayisi}</td>
                  <td style={{...tableCellStyle, color: '#666'}}>
                    {veri ? new Date(veri.kayit_tarihi).toLocaleString('tr-TR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{textAlign:'center', color:'#888', marginTop:'10px'}}>Detaylarını görmek istediğiniz oyuncunun ismine tıklayabilirsiniz.</p>
        </div>

      ) : (
        
        // --- DETAY MODU ---
        <div style={{ display: 'flex', gap: '30px', height: '70vh' }}>
          
          {/* Sol: Liste */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{fontSize: '24px', borderLeft: '5px solid #28a745', paddingLeft: '10px'}}>📝 {secilenKullanici} - Geçmiş Hareketler</h2>
            <div style={{ flex: '1', overflowY: 'auto', border: '2px solid #ccc', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{backgroundColor: '#333', color: 'white'}}>
                    <th style={{padding: '15px', fontSize: '18px'}}>Tarih</th>
                    <th style={{padding: '15px', fontSize: '18px'}}>Mermi</th>
                    <th style={{padding: '15px', fontSize: '18px'}}>Koruma</th>
                  </tr>
                </thead>
                <tbody>
                  {tabloVerisi.map((veri) => (
                    <tr key={veri.id} style={{ borderBottom: '1px solid #eee', textAlign: 'center', fontSize: '18px' }}>
                      <td style={{ padding: '15px' }}>{new Date(veri.kayit_tarihi).toLocaleString('tr-TR')}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{veri.mermi_sayisi}</td>
                      <td style={{ padding: '15px' }}>{veri.koruma_sayisi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sağ: Grafik */}
          <div style={{ flex: '1', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px', border: '1px solid #ddd' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px' }}>📈 İlerleme Grafiği</h2>
            <div style={{ height: '90%', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grafikVerisi}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="saat" tick={{fontSize: 14}} />
                  <YAxis tick={{fontSize: 14}} />
                  <Tooltip contentStyle={{fontSize: '18px'}} />
                  <Legend wrapperStyle={{fontSize: '18px'}} />
                  <Line type="monotone" dataKey="mermi_sayisi" stroke="#8884d8" name="Mermi" strokeWidth={4} />
                  <Line type="monotone" dataKey="koruma_sayisi" stroke="#82ca9d" name="Koruma" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}